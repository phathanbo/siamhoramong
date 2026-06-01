(function () {
  "use strict";

  const CYCLE = 21600;
  const SIGNS = [
    "เมษ",
    "พฤษภ",
    "เมถุน",
    "กรกฎ",
    "สิงห์",
    "กันย์",
    "ตุล",
    "พิจิก",
    "ธนู",
    "มังกร",
    "กุมภ์",
    "มีน",
  ];
  const KATAMAS = [365, 31, 62, 95, 125, 156, 187, 217, 246, 276, 305, 335];
  const SUN_TABLE = [37, 71, 98, 118, 128, 129];
  const MOON_TABLE = [87, 165, 230, 276, 298, 301];
  const LAMPA_TABLE = [9, 18, 26, 32, 37, 43, 46, 49, 50, 51, 53];
  const LUNAR_RAHU_SHADE = [1, 1, 2, 3, 4, 5, 6, 7, 12, 14];
  const SOLAR_RAHU_SHADE = [1, 2, 3, 6, 8, 11];
  const DEFAULT_ANTOJHANA = [244, 244, 272, 312, 334, 326, 326, 334, 312, 272, 244, 244];

  const $ = (id) => document.getElementById(id);

  function thaiToArabic(value) {
    return String(value ?? "").replace(/[๐-๙]/g, (ch) => "๐๑๒๓๔๕๖๗๘๙".indexOf(ch));
  }

  function toNumber(value, fallback = 0) {
    const parsed = Number(thaiToArabic(value).replace(/,/g, "").trim());
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function mod(value, divisor = CYCLE) {
    return ((value % divisor) + divisor) % divisor;
  }

  function divmod(value, divisor) {
    const q = Math.floor(value / divisor);
    return { q, r: value - q * divisor };
  }

  function roundDivBigInt(value, divisor) {
    const d = BigInt(divisor);
    let q = value / d;
    const r = value % d;
    if (r * 2n >= d) q += 1n;
    return Number(q);
  }

  function roundDiv(value, divisor) {
    return Math.floor((value + divisor / 2) / divisor);
  }

  function splitLongitude(minutes) {
    const normalized = mod(minutes);
    const sign = Math.floor(normalized / 1800);
    const signRemainder = normalized % 1800;
    const degree = Math.floor(signRemainder / 60);
    const minute = signRemainder % 60;
    return { sign, degree, minute, text: `${SIGNS[sign]} ${degree} องศา ${minute} ลิบดา` };
  }

  function parseLongitude(prefix) {
    const sign = toNumber($(`${prefix}Sign`).value);
    const degree = toNumber($(`${prefix}Degree`).value);
    const minute = toNumber($(`${prefix}Minute`).value);
    return mod(sign * 1800 + degree * 60 + minute);
  }

  function asTime(totalV) {
    const value = mod(totalV, 60 * 60);
    return { maha: Math.floor(value / 60), vina: value % 60 };
  }

  function timeToV(time) {
    return time.maha * 60 + time.vina;
  }

  function addTime(a, b) {
    return asTime(timeToV(a) + timeToV(b));
  }

  function subTime(a, b) {
    return asTime(timeToV(a) - timeToV(b));
  }

  function halfTime(a) {
    return asTime(roundDiv(timeToV(a), 2));
  }

  function formatTime(time) {
    return `${time.maha} มหานาฑี ${time.vina} มหาวินาฑี`;
  }

  function formatClockFromMaha(time) {
    const seconds = Math.round((time.maha * 24 * 60) + (time.vina * 24));
    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds % 3600) / 60);
    const ss = seconds % 60;
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  }

  function formatLongitude(minutes) {
    const p = splitLongitude(minutes);
    return `${p.sign} ${p.text}`;
  }

  function roundedProduct(seed, factor) {
    return roundDivBigInt(BigInt(seed) * BigInt(factor), 10000000n);
  }

  function interpolateBhuj(table, bhuj) {
    const kand = Math.floor(bhuj / 1000);
    const second = bhuj % 1000;
    if (kand <= 0) return Math.floor((table[0] * second) / 1000);
    const upper = table[Math.min(kand - 1, table.length - 1)];
    const lower = table[Math.min(kand, table.length - 1)];
    return upper + Math.floor(((lower - upper) * second) / 1000);
  }

  function bhujFromArc(rawArc) {
    const normalized = mod(rawArc);
    const golang = Math.floor(normalized / 5400);
    const remainder = normalized % 5400;
    const bhuj = golang === 0 || golang === 2 ? remainder : 5400 - remainder;
    const direction = golang === 0 || golang === 1 ? "ระณัง" : "ธนัง";
    const side = golang === 0 || golang === 1 ? "อุดร" : "ทักษิณ";
    return { golang, remainder, bhuj, direction, side };
  }

  function applyCorrection(mean, correction, golang) {
    return mod(golang === 0 || golang === 1 ? mean - correction : mean + correction);
  }

  function trueSun(mean) {
    const arc = mod(mean - 4680);
    const bhuj = bhujFromArc(arc);
    const correction = interpolateBhuj(SUN_TABLE, bhuj.bhuj);
    return { ...bhuj, correction, value: applyCorrection(mean, correction, bhuj.golang) };
  }

  function trueMoon(mean, ucca) {
    const arc = mod(mean - ucca);
    const bhuj = bhujFromArc(arc);
    const correction = interpolateBhuj(MOON_TABLE, bhuj.bhuj);
    return { ...bhuj, correction, value: applyCorrection(mean, correction, bhuj.golang) };
  }

  function tithiFrom(sun, moon) {
    const diff = mod(moon - sun);
    const tithi = divmod(diff, 720);
    const nadi = Math.floor((tithi.r * 60) / 720);
    return { diff, tithi: tithi.q, nadi };
  }

  function nakshatraFrom(longitude) {
    const rk = divmod(mod(longitude), 800);
    const nadi = Math.floor((rk.r * 60) / 800);
    return { rerk: rk.q, nadi };
  }

  function calculateUnathinFromMaha() {
    const csYear = toNumber($("csYear").value);
    const sunSign = toNumber($("sunMonthSign").value);
    const sunDegree = toNumber($("sunMonthDegree").value);
    const maha = csYear + 560;
    const drub = maha - 1065;
    let day = drub * 365;
    let mahaNadi = drub * 15;
    let petNadi = drub * 31;
    let aksorn = drub * 30;
    const carryPet = Math.floor(aksorn / 60);
    petNadi += carryPet;
    const carryMaha = Math.floor(petNadi / 60);
    mahaNadi += carryMaha;
    const carryDay = Math.floor(mahaNadi / 60);
    day += carryDay;
    return {
      mode: "มหาศักราช",
      maha,
      drub,
      unathin: day + 157 + KATAMAS[sunSign] + sunDegree,
      detail: [
        `จ.ศ. ${csYear} + 560 = ${maha} มหาศักราช`,
        `${maha} - 1065 = ${drub} ทรุพ`,
        `วันฐานบน ${day}; บวก 157 + คตมาส ${KATAMAS[sunSign]} + องศา ${sunDegree}`,
      ],
    };
  }

  function calculateUnathin() {
    const direct = toNumber($("directUnathin").value);
    if (direct > 0) return { mode: "กำหนดเอง", unathin: direct, detail: ["ใช้ค่าอุณทินที่ผู้ใช้ระบุโดยตรง"] };

    const harakhun = toNumber($("harakhun").value);
    const suthin = toNumber($("suthin").value);
    if (harakhun > 0) {
      return {
        mode: "หรคุณ",
        unathin: harakhun + suthin - 184298,
        detail: [`${harakhun} + ${suthin} - 184298 = ${harakhun + suthin - 184298}`],
      };
    }
    return calculateUnathinFromMaha();
  }

  function sarambhaCore() {
    const unathinInfo = calculateUnathin();
    const seed = unathinInfo.unathin - 1;
    const sunPower = roundedProduct(seed, 591361716);
    const moonPower = roundedProduct(seed, 7905810032);
    const uccaPower = roundedProduct(seed, 66818670);
    const rahuPower = roundedProduct(seed, 31800373);

    const meanSun1 = mod(sunPower + 12268);
    const meanSun2 = mod(meanSun1 + 59);
    const meanMoon1 = mod(moonPower + 11339);
    const meanMoon2 = mod(meanMoon1 + 790);
    const meanUcca1 = mod(uccaPower + 17641);
    const meanUcca2 = mod(meanUcca1 + 7);
    const meanRahu1 = mod(rahuPower - 8014);
    const meanRahu2 = mod(meanRahu1 + 3);

    const sun1 = trueSun(meanSun1);
    const sun2 = trueSun(meanSun2);
    const moon1 = trueMoon(meanMoon1, meanUcca1);
    const moon2 = trueMoon(meanMoon2, meanUcca2);
    const rahu1 = mod(CYCLE - meanRahu1);
    const rahu2 = mod(CYCLE - meanRahu2);

    return {
      unathinInfo,
      powers: { sunPower, moonPower, uccaPower, rahuPower },
      means: { meanSun1, meanSun2, meanMoon1, meanMoon2, meanUcca1, meanUcca2, meanRahu1, meanRahu2 },
      trueBodies: { sun1, sun2, moon1, moon2, rahu1, rahu2 },
      tithi1: tithiFrom(sun1.value, moon1.value),
      tithi2: tithiFrom(sun2.value, moon2.value),
      moonRerk1: nakshatraFrom(moon1.value),
      moonRerk2: nakshatraFrom(moon2.value),
      rahuRerk1: nakshatraFrom(rahu1),
      rahuRerk2: nakshatraFrom(rahu2),
    };
  }

  function multiplyTimeRate(time, rate) {
    return roundDiv(timeToV(time) * rate, 3600);
  }

  function divideToTime(numerator, divisor) {
    const maha = Math.floor(numerator / divisor);
    const rem = numerator % divisor;
    const vina = roundDiv(rem * 60, divisor);
    return asTime(maha * 60 + vina);
  }

  function subtractShade(time, shades) {
    let maha = time.maha;
    const vina = time.vina;
    let used = 0;
    for (const shade of shades) {
      if (maha - shade < 0) {
        const interpolated = Math.floor((maha * 60 + vina) / shade);
        return asTime(used * 60 + interpolated);
      }
      maha -= shade;
      used += 1;
    }
    return asTime(used * 60 + vina);
  }

  function lunarEclipse(core) {
    const { means, trueBodies } = core;
    const raviBhukti = mod(means.meanSun2 - means.meanSun1);
    const raviTrueBhukti = mod(trueBodies.sun2.value - trueBodies.sun1.value);
    const moonBhukti = mod(means.meanMoon2 - means.meanMoon1);
    const moonTrueBhukti = mod(trueBodies.moon2.value - trueBodies.moon1.value);
    const bhuMoon = moonTrueBhukti - raviTrueBhukti;
    const shadow = mod(trueBodies.sun1.value + 10800);
    const grahaHantakula = Math.abs(shadow - trueBodies.moon1.value);
    const punami = divideToTime(grahaHantakula * 60, bhuMoon);
    const samRavi = multiplyTimeRate(punami, raviTrueBhukti);
    const samMoon = multiplyTimeRate(punami, moonTrueBhukti);
    const samRahu = multiplyTimeRate(punami, 3);
    const takkalaRavi = mod(shadow + samRavi);
    const takkalaMoon = mod(trueBodies.moon1.value + samMoon);
    const takkalaRahu = mod(trueBodies.rahu1 - samRahu);
    const rahuArc = mod(takkalaRahu - takkalaMoon);
    const rahuBhuj = bhujFromArc(rahuArc);
    const hasEclipse = rahuBhuj.bhuj < 720 && rahuBhuj.bhuj <= moonTrueBhukti;
    const rahuVikkhip = asTime(Math.floor((rahuBhuj.bhuj * 9) / 2));
    const moonImage = divideToTime(31 * moonTrueBhukti, moonBhukti);
    const rahuImage = halfTime(asTime(timeToV(moonImage) * 5));
    const paniMoon = halfTime(moonImage);
    const paniRahu = halfTime(rahuImage);
    const mulaBase = subTime({ maha: 54, vina: 0 }, rahuVikkhip);
    const mula = subtractShade(mulaBase, LUNAR_RAHU_SHADE);
    const tittha = halfTime(mula);
    const entry = subTime(punami, tittha);
    const release = addTime(punami, tittha);
    return {
      raviBhukti,
      raviTrueBhukti,
      moonBhukti,
      moonTrueBhukti,
      bhuMoon,
      shadow,
      grahaHantakula,
      punami,
      samRavi,
      samMoon,
      samRahu,
      takkalaRavi,
      takkalaMoon,
      takkalaRahu,
      rahuBhuj,
      hasEclipse,
      rahuVikkhip,
      moonImage,
      rahuImage,
      paniMoon,
      paniRahu,
      mula,
      tittha,
      entry,
      release,
    };
  }

  function solarEclipse(core) {
    const { means, trueBodies } = core;
    const raviBhukti = mod(means.meanSun2 - means.meanSun1);
    const raviTrueBhukti = mod(trueBodies.sun2.value - trueBodies.sun1.value);
    const moonBhukti = mod(means.meanMoon2 - means.meanMoon1);
    const moonTrueBhukti = mod(trueBodies.moon2.value - trueBodies.moon1.value);
    const bhuMoon = moonTrueBhukti - raviTrueBhukti;
    const diff = mod(trueBodies.moon1.value - trueBodies.sun1.value);
    const tithi = Math.floor(diff / 720);
    const grahaHantakula = 720 - (diff % 720);
    const amavasi = divideToTime(grahaHantakula * 60, bhuMoon);
    const samRavi = multiplyTimeRate(amavasi, raviTrueBhukti);
    const samMoon = multiplyTimeRate(amavasi, moonTrueBhukti);
    const samRahu = multiplyTimeRate(amavasi, 3);
    const takkalaRavi = mod(trueBodies.sun1.value + samRavi);
    const takkalaMoon = mod(trueBodies.moon1.value + samMoon);
    const takkalaRahu = mod(trueBodies.rahu1 - samRahu);
    const rahuArc = mod(takkalaRavi - takkalaRahu);
    const firstVikkhip = bhujFromArc(rahuArc);
    const firstRahuVikkhip = divideToTime(firstVikkhip.bhuj * 60, 800);
    const raviImage = divideToTime(31 * raviTrueBhukti, raviBhukti);
    const moonImage = divideToTime(31 * moonTrueBhukti, moonBhukti);
    const manyakas = halfTime(addTime(raviImage, moonImage));
    const latitude = {
      maha: toNumber($("latitudeDegree").value, 13),
      vina: toNumber($("latitudeMinute").value, 44),
      side: "ทักษิณ",
    };
    const pureVikkhipV = latitude.side === firstVikkhip.side
      ? timeToV(latitude) + timeToV(firstRahuVikkhip)
      : Math.abs(timeToV(latitude) - timeToV(firstRahuVikkhip));
    const pureVikkhip = asTime(pureVikkhipV);
    const hasEclipse = timeToV(manyakas) > timeToV(pureVikkhip);
    const eclipseAnguli = asTime(timeToV(manyakas) - timeToV(pureVikkhip));
    const remainingLight = subTime(raviImage, eclipseAnguli);
    const sthitKhrasBase = subTime({ maha: 32, vina: 0 }, pureVikkhip);
    const sthitKhras = subtractShade(sthitKhrasBase, SOLAR_RAHU_SHADE);
    const sthitYatra = halfTime(sthitKhras);
    const entry = subTime(amavasi, sthitYatra);
    const release = addTime(amavasi, sthitYatra);
    return {
      raviBhukti,
      raviTrueBhukti,
      moonBhukti,
      moonTrueBhukti,
      bhuMoon,
      tithi,
      grahaHantakula,
      amavasi,
      samRavi,
      samMoon,
      samRahu,
      takkalaRavi,
      takkalaMoon,
      takkalaRahu,
      firstVikkhip,
      firstRahuVikkhip,
      latitude,
      raviImage,
      moonImage,
      manyakas,
      pureVikkhip,
      hasEclipse,
      eclipseAnguli,
      remainingLight,
      sthitKhras,
      sthitYatra,
      entry,
      release,
    };
  }

  function preliminaryFromManual() {
    const sun = parseLongitude("manualSun");
    const moon = parseLongitude("manualMoon");
    const rahu = parseLongitude("manualRahu");
    const solarDiff = Math.min(mod(moon - sun), mod(sun - moon));
    const lunarDiff = Math.abs(mod(moon - sun) - 10800);
    const nodeNearSun = Math.min(mod(rahu - sun), mod(sun - rahu), Math.abs(mod(rahu - sun) - 10800));
    const nodeNearMoon = Math.min(mod(rahu - moon), mod(moon - rahu), Math.abs(mod(rahu - moon) - 10800));
    return {
      sun,
      moon,
      rahu,
      solarDiff,
      lunarDiff,
      nodeNearSun,
      nodeNearMoon,
      solarCandidate: solarDiff <= 720 && nodeNearSun <= 1800,
      lunarCandidate: lunarDiff <= 720 && nodeNearMoon <= 1800,
      tithi: tithiFrom(sun, moon),
      moonRerk: nakshatraFrom(moon),
      rahuRerk: nakshatraFrom(rahu),
    };
  }

  function row(label, value, note = "") {
    return `<tr><th>${label}</th><td>${value}</td><td>${note}</td></tr>`;
  }

  function renderCore(core) {
    const m = core.means;
    const t = core.trueBodies;
    const p = core.powers;
    return `
      <section class="panel">
        <h2>สุริยยาตร์สารัมภ์</h2>
        <table>
          <tbody>
            ${row("อุณทิน", core.unathinInfo.unathin, core.unathinInfo.detail.join(" | "))}
            ${row("พลอาทิตย์", p.sunPower, "ปัดอัฑฒาธิกรรมด้วยการตัด 7 หลักท้าย")}
            ${row("พลจันทร์", p.moonPower)}
            ${row("พลอุจจ์", p.uccaPower)}
            ${row("พลราหู", p.rahuPower)}
            ${row("มัธยมอาทิตย์ ปฐม/ทุติย", `${formatLongitude(m.meanSun1)} / ${formatLongitude(m.meanSun2)}`)}
            ${row("มัธยมจันทร์ ปฐม/ทุติย", `${formatLongitude(m.meanMoon1)} / ${formatLongitude(m.meanMoon2)}`)}
            ${row("มัธยมอุจจ์ ปฐม/ทุติย", `${formatLongitude(m.meanUcca1)} / ${formatLongitude(m.meanUcca2)}`)}
            ${row("มัธยมราหู ปฐม/ทุติย", `${formatLongitude(m.meanRahu1)} / ${formatLongitude(m.meanRahu2)}`)}
            ${row("สมผุสอาทิตย์ ปฐม/ทุติย", `${formatLongitude(t.sun1.value)} / ${formatLongitude(t.sun2.value)}`, `รวิภุชผล ${t.sun1.correction}/${t.sun2.correction}`)}
            ${row("สมผุสจันทร์ ปฐม/ทุติย", `${formatLongitude(t.moon1.value)} / ${formatLongitude(t.moon2.value)}`, `จันทร์ภุชผล ${t.moon1.correction}/${t.moon2.correction}`)}
            ${row("สมผุสราหู ปฐม/ทุติย", `${formatLongitude(t.rahu1)} / ${formatLongitude(t.rahu2)}`)}
            ${row("ดิถี ปฐม/ทุติย", `${core.tithi1.tithi} นาฑี ${core.tithi1.nadi} / ${core.tithi2.tithi} นาฑี ${core.tithi2.nadi}`)}
            ${row("ฤกษ์จันทร์ ปฐม/ทุติย", `${core.moonRerk1.rerk} นาฑี ${core.moonRerk1.nadi} / ${core.moonRerk2.rerk} นาฑี ${core.moonRerk2.nadi}`)}
            ${row("ฤกษ์ราหู ปฐม/ทุติย", `${core.rahuRerk1.rerk} นาฑี ${core.rahuRerk1.nadi} / ${core.rahuRerk2.rerk} นาฑี ${core.rahuRerk2.nadi}`)}
          </tbody>
        </table>
      </section>
    `;
  }

  function renderLunar(lunar) {
    return `
      <section class="panel">
        <h2>จันทรคราส</h2>
        <table>
          <tbody>
            ${row("รวิภุกดิ / รวิภุกดภุกดิ", `${lunar.raviBhukti} / ${lunar.raviTrueBhukti}`)}
            ${row("จันทร์ภุกดิ / จันทร์ภุกดภุกดิ", `${lunar.moonBhukti} / ${lunar.moonTrueBhukti}`)}
            ${row("ภูจันทร์", lunar.bhuMoon)}
            ${row("ฉายาเคราะห์", formatLongitude(lunar.shadow))}
            ${row("เคราะห์หันตกุลา", lunar.grahaHantakula)}
            ${row("ปุณมี", formatTime(lunar.punami), formatClockFromMaha(lunar.punami))}
            ${row("ตักกลารวิ / ตักกลาจันทร์", `${formatLongitude(lunar.takkalaRavi)} / ${formatLongitude(lunar.takkalaMoon)}`)}
            ${row("ตักกลาราหู", formatLongitude(lunar.takkalaRahu))}
            ${row("ราหูภุช", `${lunar.rahuBhuj.bhuj}`, `${lunar.rahuBhuj.side}; ${lunar.hasEclipse ? "มีคราสตามเกณฑ์ราหูภุช" : "ไม่เข้าเกณฑ์คราส"}`)}
            ${row("ราหูวิกขิป", formatTime(lunar.rahuVikkhip))}
            ${row("จันทร์พิมพ์ / ราหูพิมพ์", `${formatTime(lunar.moonImage)} / ${formatTime(lunar.rahuImage)}`)}
            ${row("ปนีจันทร์ / ปนีราหู", `${formatTime(lunar.paniMoon)} / ${formatTime(lunar.paniRahu)}`)}
            ${row("มูลมหานาฑี / ติตถ", `${formatTime(lunar.mula)} / ${formatTime(lunar.tittha)}`)}
            ${row("มัธยมประเวสกาล", `${formatTime(lunar.entry)} (${formatClockFromMaha(lunar.entry)})`)}
            ${row("มัธยมโมกษกาล", `${formatTime(lunar.release)} (${formatClockFromMaha(lunar.release)})`)}
          </tbody>
        </table>
      </section>
    `;
  }

  function renderSolar(solar) {
    return `
      <section class="panel">
        <h2>สุริยคราส</h2>
        <table>
          <tbody>
            ${row("อมาวสี", `${formatTime(solar.amavasi)} (${formatClockFromMaha(solar.amavasi)})`, `ดิถี ${solar.tithi}`)}
            ${row("ตักกลารวิ / ตักกลาจันทร์", `${formatLongitude(solar.takkalaRavi)} / ${formatLongitude(solar.takkalaMoon)}`)}
            ${row("ตักกลาราหู", formatLongitude(solar.takkalaRahu))}
            ${row("ปฐมราหูวิกเขป", `${formatTime(solar.firstRahuVikkhip)} ${solar.firstVikkhip.side}`)}
            ${row("รวิพิมพ์ / จันทร์พิมพ์", `${formatTime(solar.raviImage)} / ${formatTime(solar.moonImage)}`)}
            ${row("มานยกาษฐ์", formatTime(solar.manyakas))}
            ${row("สุทธิวิกเขป", formatTime(solar.pureVikkhip), `ใช้ละติจูด ${solar.latitude.maha}°${solar.latitude.vina}' กรุงเทพฯ/ผู้ใช้กำหนด`)}
            ${row("ผลตรวจคราส", solar.hasEclipse ? "มีสุริยคราสตามเกณฑ์มานยกาษฐ์" : "ไม่เข้าเกณฑ์คราส")}
            ${row("คราสสางคุลี", formatTime(solar.eclipseAnguli))}
            ${row("ราหูกินไม่สิ้น", formatTime(solar.remainingLight))}
            ${row("สถิตย์คราส / สถิตย์ยาตร์", `${formatTime(solar.sthitKhras)} / ${formatTime(solar.sthitYatra)}`)}
            ${row("มัธยมประเวสกาล", `${formatTime(solar.entry)} (${formatClockFromMaha(solar.entry)})`)}
            ${row("มัธยมโมกษกาล", `${formatTime(solar.release)} (${formatClockFromMaha(solar.release)})`)}
          </tbody>
        </table>
      </section>
    `;
  }

  function renderPreliminary(check) {
    return `
      <section class="panel">
        <h2>ตรวจคราสจากสมผุสที่ระบุ</h2>
        <table>
          <tbody>
            ${row("อาทิตย์ / จันทร์ / ราหู", `${formatLongitude(check.sun)} / ${formatLongitude(check.moon)} / ${formatLongitude(check.rahu)}`)}
            ${row("ดิถี", `${check.tithi.tithi} นาฑีดิถี ${check.tithi.nadi}`)}
            ${row("ฤกษ์จันทร์ / ฤกษ์ราหู", `${check.moonRerk.rerk}:${check.moonRerk.nadi} / ${check.rahuRerk.rerk}:${check.rahuRerk.nadi}`)}
            ${row("สุริยคราส", check.solarCandidate ? "ควรคำนวณต่อ" : "ยังไม่เข้าเงื่อนไขเบื้องต้น", `อาทิตย์-จันทร์ห่าง ${check.solarDiff} ลิบดา`)}
            ${row("จันทรคราส", check.lunarCandidate ? "ควรคำนวณต่อ" : "ยังไม่เข้าเงื่อนไขเบื้องต้น", `ระยะเล็ง ${check.lunarDiff} ลิบดา`)}
          </tbody>
        </table>
      </section>
    `;
  }

  async function fetchExternal() {
    const url = $("externalUrl").value.trim();
    if (!url) return;
    $("externalStatus").textContent = "กำลังดึงข้อมูล...";
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      $("externalText").value = text.slice(0, 12000);
      $("externalStatus").textContent = "ดึงข้อมูลแล้ว ตรวจตัวเลขก่อนนำไปใช้";
    } catch (error) {
      $("externalStatus").textContent = `ดึงไม่ได้: ${error.message} (เว็บปลายทางอาจปิด CORS)`;
    }
  }

  function calculate() {
    const core = sarambhaCore();
    const lunar = lunarEclipse(core);
    const solar = solarEclipse(core);
    const manual = preliminaryFromManual();
    $("results").innerHTML = renderCore(core) + renderPreliminary(manual) + renderLunar(lunar) + renderSolar(solar);
  }

  function useExample() {
    $("csYear").value = 1257;
    $("harakhun").value = 459131;
    $("suthin").value = 320;
    $("directUnathin").value = "";
    $("sunMonthSign").value = 10;
    $("sunMonthDegree").value = 17;
    $("manualSunSign").value = 10;
    $("manualSunDegree").value = 17;
    $("manualSunMinute").value = 26;
    $("manualMoonSign").value = 4;
    $("manualMoonDegree").value = 16;
    $("manualMoonMinute").value = 50;
    $("manualRahuSign").value = 10;
    $("manualRahuDegree").value = 10;
    $("manualRahuMinute").value = 38;
    calculate();
  }

  function init() {
    $("calculateBtn").addEventListener("click", calculate);
    $("exampleBtn").addEventListener("click", useExample);
    $("fetchExternalBtn").addEventListener("click", fetchExternal);
    useExample();
  }

  window.addEventListener("DOMContentLoaded", init);
  window.SaramphaCalculator = {
    sarambhaCore,
    lunarEclipse,
    solarEclipse,
    preliminaryFromManual,
  };
})();
