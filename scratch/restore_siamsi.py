
# -*- coding: utf-8 -*-
import re

html_file = "index.html"

with open(html_file, "r", encoding="utf-8") as f:
    html_content = f.read()

# The full correct HTML for siamsiResult
full_modal_html = """
            <!-- Siamsi Modal Overlay -->
            <div id="siamsiResult" class="siamsi-modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 1050; justify-content: center; align-items: center; padding: 1rem; backdrop-filter: blur(5px); flex-direction: column;">
                
                <div id="siamsiTicketWrapper" style="display: none; width: 100%; max-width: 450px; position: relative;">
                    <!-- Close button for modal -->
                    <button onclick="document.getElementById('siamsiResult').style.display='none'; resetSiamsi();" style="position: absolute; top: -15px; right: -15px; width: 40px; height: 40px; border-radius: 50%; background: #dc3545; color: white; border: 2px solid white; font-size: 1.2rem; cursor: pointer; z-index: 10; box-shadow: 0 4px 8px rgba(0,0,0,0.3); display: flex; justify-content: center; align-items: center;">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <div id="siamsiTicket" class="card text-dark shadow-lg" style="background-color: #fcf8e3; background-image: url('assets/images/paper-texture.jpg'); background-size: cover; border: 3px solid #d4af37; border-radius: 12px; width: 100%; animation: slideUpFade 0.4s ease-out;">
                        <div class="card-body p-4 text-center">
                            <h3 class="mb-3" style="font-weight: bold; color: #b82a2a; border-bottom: 2px dashed #d4af37; padding-bottom: 15px;">ใบเซียมซีที่ <span id="ticketNum"></span></h3>
                            <div class="mb-3" style="font-size: 1.1rem; color: #5a3d1b;"><strong>ผลการเสี่ยงทาย: </strong><span id="ticketType" style="color: #b82a2a; font-weight: bold;"></span></div>
                            
                            <div class="mb-4 p-3" style="font-size: 1.25rem; line-height: 1.8; white-space: pre-wrap; font-style: italic; color: #333; background: rgba(255,255,255,0.6); border-radius: 8px;"><span id="ticketPoem"></span></div>
                            
                            <div class="text-left small mx-auto" style="line-height: 1.8; color: #444; max-width: 95%;">
                                <div class="d-flex mb-2 border-bottom pb-2 border-light"><div style="min-width: 75px; color: #6b4c1e;">💼 <strong>การงาน:</strong></div><div><span id="ticketWork"></span></div></div>
                                <div class="d-flex mb-2 border-bottom pb-2 border-light"><div style="min-width: 75px; color: #d63384;">❤️ <strong>ความรัก:</strong></div><div><span id="ticketLove"></span></div></div>
                                <div class="d-flex mb-0 pt-1"><div style="min-width: 75px; color: #198754;">🏥 <strong>สุขภาพ:</strong></div><div><span id="ticketHealth"></span></div></div>
                            </div>
                            
                            <div class="mt-4 pt-3" style="border-top: 1px solid #d4af37;">
                                <p class="small mb-0" style="color: #b82a2a; font-weight: bold;">สยามโหรามงคล</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-4 w-100" style="max-width: 450px; animation: slideUpFade 0.5s ease-out;">
                    <div class="d-flex justify-content-center flex-wrap gap-3">
                        <button onclick="resetSiamsi()" class="btn btn-light rounded-pill px-4 py-2 mx-1 mb-2 shadow fw-bold" style="color: #b82a2a; border: 2px solid #b82a2a;">
                            <i class="fas fa-redo mr-2"></i> เสี่ยงใหม่
                        </button>
                        <button onclick="downloadSiamsiTicket()" class="btn rounded-pill px-4 py-2 mx-1 mb-2 shadow fw-bold" style="background-color: #b82a2a; color: white; border: 2px solid #b82a2a;">
                            <i class="fas fa-download mr-2"></i> บันทึกรูปภาพ
                        </button>
                    </div>
                </div>

                <div id="siamsiImagePreviewContainer" class="text-center mt-3 d-flex justify-content-center" style="display: none !important;"></div>
            </div>
"""

# Remove the broken one (which ends right after </div></div></div>)
html_content = re.sub(r'<!-- Siamsi Modal Overlay -->.*?</div>\s*</div>\s*</div>\s*</body>', full_modal_html + '\n</body>', html_content, flags=re.DOTALL)

with open(html_file, "w", encoding="utf-8") as f:
    f.write(html_content)
print("Restored")

