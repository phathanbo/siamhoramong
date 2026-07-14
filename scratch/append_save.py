
import codecs

save_logic = """

// ==========================================
// UNIVERSAL SAVE IMAGE FEATURE
// ==========================================
window.initUniversalSaveButtons = function() {
    const containers = document.querySelectorAll(".exportable-result");

    containers.forEach(container => {
        const btnWrapper = document.createElement("div");
        btnWrapper.className = "text-center mt-3 mb-4 universal-save-btn-wrapper";
        btnWrapper.style.display = "none"; 
        
        const btn = document.createElement("button");
        btn.className = "btn btn-outline-gold px-4 py-2 shadow-sm";
        btn.innerHTML = "<i class=\"fas fa-camera mr-2\"></i> บันทึกผลลัพธ์เป็นรูปภาพ";
        btn.onclick = () => window.downloadUniversalImage(container.id);
        
        btnWrapper.appendChild(btn);
        
        if (container.parentNode) {
            container.parentNode.insertBefore(btnWrapper, container.nextSibling);
        }

        const checkVisibility = () => {
            const hasContent = container.innerHTML.trim().length > 10;
            const isVisible = window.getComputedStyle(container).display !== "none" && not container.classList.contains("d-none");
            
            if (hasContent and isVisible) {
                btnWrapper.style.display = "block";
            } else {
                btnWrapper.style.display = "none";
            }
        };

        checkVisibility();

        const observer = new MutationObserver((mutations) => {
            checkVisibility();
        });

        observer.observe(container, {
            childList: True,
            subtree: True,
            attributes: True,
            attributeFilter: ["style", "class"]
        });
    });
};

window.downloadUniversalImage = function(containerId) {
    const area = document.getElementById(containerId);
    if (!area) return;

    Swal.fire({
        title: "กำลังสร้างรูปภาพ...",
        text: "กรุณารอสักครู่",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    html2canvas(area, {
        scale: 2,
        backgroundColor: "#fdf6e3",
        onclone: function(clonedDoc) {
            const target = clonedDoc.getElementById(containerId);
            if (target) {
                target.style.position = "relative";
                
                const watermark = clonedDoc.createElement("div");
                watermark.style.position = "absolute";
                watermark.style.top = "0";
                watermark.style.left = "0";
                watermark.style.width = "100%";
                watermark.style.height = "100%";
                watermark.style.pointerEvents = "none";
                watermark.style.zIndex = "0";
                
                watermark.style.background = "radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(253,246,227,0) 70%)";
                
                watermark.style.display = "flex";
                watermark.style.alignItems = "center";
                watermark.style.justifyContent = "center";
                watermark.innerHTML = "<div style=\"transform: rotate(-30deg); font-size: 5rem; color: rgba(212,175,55,0.1); font-weight: bold; white-space: nowrap; user-select: none;\">สยามโหรามงคล</div>";

                if (target.firstChild) {
                    target.insertBefore(watermark, target.firstChild);
                } else {
                    target.appendChild(watermark);
                }
                
                Array.from(target.children).forEach(child => {
                    if (child !== watermark && window.getComputedStyle(child).position === "static") {
                        child.style.position = "relative";
                        child.style.zIndex = "1";
                    }
                });
            }
        }
    }).then(canvas => {
        Swal.close();
        const link = document.createElement("a");
        link.download = `Siamhora_${containerId}_${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    }).catch(err => {
        Swal.close();
        console.error("Save image error:", err);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกรูปภาพได้ กรุณาลองใหม่", "error");
    });
};

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(window.initUniversalSaveButtons, 1000);
});
"""
save_logic = save_logic.replace("not container", "!container").replace("and isVisible", "&& isVisible").replace("True", "true")

with codecs.open("script.js", "a", "utf-8") as f:
    f.write(save_logic)


