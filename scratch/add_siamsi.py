
# -*- coding: utf-8 -*-
filename = "index.html"
with open(filename, "r", encoding="utf-8") as f:
    content = f.read()

siamsi_html = """
    <!-- siamsi page -->
    <section id="siamsiPage" class="main-section" style="display: none;">
        <div class="container mt-4">
            <h2 class="text-center mb-4 text-warning"><i class="fas fa-drum"></i> เสี่ยงเซียมซี</h2>
            
            <div class="card bg-dark text-light border-warning shadow-lg mb-4">
                <div class="card-body text-center">
                    <p class="mb-4 text-muted">ตั้งจิตอธิษฐานถึงสิ่งศักดิ์สิทธิ์ที่ท่านเคารพนับถือ แล้วกดปุ่มเพื่อเขย่าเซียมซี</p>
                    
                    <div id="siamsiAnimationContainer" class="mb-4" style="height: 150px; display: flex; justify-content: center; align-items: center; overflow: hidden;">
                        <div id="siamsiCylinder" style="font-size: 5rem; color: #d4af37; transition: transform 0.1s;">
                            <i class="fas fa-prescription-bottle"></i>
                        </div>
                    </div>

                    <button id="shakeSiamsiBtn" class="btn btn-warning btn-lg shadow rounded-pill px-5">
                        <i class="fas fa-drum mr-2"></i> เสี่ยงทาย
                    </button>
                </div>
            </div>

            <div id="siamsiResult" style="display: none;">
                <div id="siamsiTicketWrapper" class="card bg-dark text-warning border-warning shadow-lg mb-4 p-4 text-center exportable-result" style="background-image: url('assets/images/gold-texture.jpg'); background-size: cover; background-blend-mode: overlay;">
                    <h3 class="mb-3">ใบเซียมซีที่ <span id="siamsiTicketNum"></span></h3>
                    <div id="siamsiTicket" class="mb-4" style="font-size: 1.2rem; line-height: 1.8; white-space: pre-wrap;"></div>
                    <p class="text-muted small">คำทำนายโดย สยามโหรามงคล</p>
                </div>

                <div class="text-center mb-4">
                    <button onclick="resetSiamsi()" class="btn btn-outline-warning">
                        <i class="fas fa-redo mr-2"></i> เสี่ยงใหม่อีกครั้ง
                    </button>
                </div>

                <div id="siamsiImagePreviewContainer" class="text-center"></div>
            </div>
        </div>
    </section>
"""

if 'id="siamsiPage"' not in content:
    content = content.replace('<section id="mainContent" class="main-section">', 
                              siamsi_html + '\n    <section id="mainContent" class="main-section">')
    
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)

