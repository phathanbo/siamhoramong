"use strict";

const PersonalFortune = {

    // ======================
    // TAKSA (แก้ไม่ให้ซ้ำ + สมดุล)
    // ======================
    TAKSA_MAP: {
        0: { sri: 6, montri: 5, kali: 2 },
        1: { sri: 2, montri: 3, kali: 6 },
        2: { sri: 3, montri: 4, kali: 7 },
        3: { sri: 5, montri: 0, kali: 1 },
        4: { sri: 1, montri: 2, kali: 3 },
        5: { sri: 0, montri: 1, kali: 7 },
        6: { sri: 4, montri: 7, kali: 0 },
        7: { sri: 2, montri: 3, kali: 5 }
    },

    TIME_LABELS: [
        "06:00 - 07:30", "07:30 - 09:00", "09:00 - 10:30", "10:30 - 12:00",
        "12:00 - 13:30", "13:30 - 15:00", "15:00 - 16:30", "16:30 - 18:00"
    ],

    cache: null,

    // ======================
    // USER DATA
    // ======================
    getUserData() {
        try {
            const raw = localStorage.getItem('userBirthdate');
            if (!raw || raw === "undefined") return null;

            const date = new Date(raw);
            if (isNaN(date.getTime())) return null;

            return {
                dayOfWeek: date.getDay()
            };
        } catch (e) {
            console.warn("UserData error:", e);
            return null;
        }
    },

    // ======================
    // SAFE ACCESS
    // ======================
    safeGetYarmChart() {
        if (typeof YARM_CHART === "undefined" || !YARM_CHART?.day) {
            console.warn("YARM_CHART missing");
            return null;
        }
        return YARM_CHART;
    },

    safeGetYarmInfo(starId) {
        if (typeof YARM_INFO === "undefined") {
            return { name: "ไม่ทราบ" };
        }
        return YARM_INFO[starId] || { name: "ไม่ทราบ" };
    },

    safeGetStarColor(starId) {
        if (typeof getStarColor !== "function") {
            return "#d4af37";
        }
        return getStarColor(starId);
    },

    // ======================
    // TIME CALC
    // ======================
    getYarmTime(starId) {
        const chart = this.safeGetYarmChart();
        if (!chart) return "ไม่สามารถคำนวณเวลาได้";

        const today = new Date().getDay();
        const dayYarms = chart.day[today] || [];

        const index = dayYarms.indexOf(starId);

        return index !== -1
            ? this.TIME_LABELS[index] || "ไม่ทราบเวลา"
            : "ช่วงกลางคืน (18:00+)";
    },

    // ======================
    // CORE
    // ======================
    getAdvice() {

        // cache กันคำนวณซ้ำ
        if (this.cache) return this.cache;

        const user = this.getUserData();
        if (!user) return null;

        const taksa = this.TAKSA_MAP[user.dayOfWeek] || this.TAKSA_MAP[0];

        const result = {
            love: this.formatAdvice(taksa.sri, "ความรัก", "ช่วงเสน่ห์แรง เหมาะพบปะ"),
            work: this.formatAdvice(taksa.montri, "การงาน", "ผู้ใหญ่สนับสนุน"),
            money: this.formatAdvice(6, "การเงิน", "มีโอกาสโชคลาภ"),
            caution: this.formatAdvice(taksa.kali, "ข้อควรระวัง", "ควรหลีกเลี่ยงการเสี่ยง", true)
        };

        this.cache = result;
        return result;
    },

    formatAdvice(starId, title, note, isWarning = false) {
        const info = this.safeGetYarmInfo(starId);

        return {
            title,
            starId,
            yarmName: info.name,
            time: this.getYarmTime(starId),
            note,
            isWarning
        };
    },

    // ======================
    // UI
    // ======================
    renderProfileFortune() {

        const el = document.getElementById('personalFortuneArea');
        if (!el) return;

        const data = this.getAdvice();

        if (!data) {
            el.innerHTML = `
                <div class="alert alert-warning text-center">
                    กรุณาระบุวันเกิดก่อนใช้งาน
                </div>`;
            return;
        }

        el.innerHTML = `
            <div class="row">
                ${this.createCard(data.love, 'heart', 'text-danger')}
                ${this.createCard(data.work, 'briefcase', 'text-info')}
                ${this.createCard(data.money, 'coins', 'text-warning')}
                ${this.createCard(data.caution, 'exclamation-triangle', 'text-secondary')}
            </div>
        `;
    },

    createCard(item, icon, color) {

        const starColor = this.safeGetStarColor(item.starId);

        return `
            <div class="col-12 mb-2">
                <div class="card bg-dark border-gold shadow-sm">
                    <div class="card-body d-flex">

                        <div style="width:50px;text-align:center">
                            <i class="fas fa-${icon} ${item.isWarning ? 'text-danger' : color}"></i>
                        </div>

                        <div style="flex:1">
                            <div class="d-flex justify-content-between">
                                <small style="color: #d4af37">ยามเด่น เรื่อง${item.title}</small>
                                <small style="color: #d4af37">คือเวลา ${item.time}</small>
                            </div>

                            <div style="color:${starColor}">
                                <b class="small text-muted">คือ</b> ${item.yarmName} <b class="small text-muted">
                                    ${item.note}</b>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    PersonalFortune.renderProfileFortune();
});