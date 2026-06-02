/* ==========================================================================
   FAZA WEB PREMIUM JAVASCRIPT LOGIC
   Features: Smooth Tab Switching, Live Price Calculator, FAQ Accordion,
             and Automated WhatsApp Lead Generation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. FORMAT UTILITY (RUPIAH)
    // ==========================================
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number);
    };

    // ==========================================
    // 2. INTERACTIVE TAB NAVIGATION SYSTEM
    // ==========================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetPanelId = button.getAttribute('aria-controls');

            // 1. Deactivate all buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });

            // 2. Hide all panels with a clean transition
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
            });

            // 3. Activate current button
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            // 4. Show current panel
            const targetPanel = document.getElementById(targetPanelId);
            targetPanel.classList.add('active');
        });
    });

    // Support smooth scrolling and automatic tab switching for all internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return; // Skip empty hash triggers
            
            // Check if this link targets one of our tabs or the tab section itself
            if (href === '#cara-kerja' || href === '#paket' || href.startsWith('#tab-section')) {
                e.preventDefault();
                
                const tabSection = document.getElementById('tab-section');
                if (tabSection) {
                    // 1. Scroll to the tab section smoothly
                    tabSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // 2. Dynamically determine which tab to activate
                    const linkText = link.textContent.toLowerCase().trim();
                    
                    if (href === '#paket' || linkText.includes('paket') || linkText.includes('harga')) {
                        tabButtons[0].click(); // Activate "Paket & Harga"
                    } else if (href === '#cara-kerja' || linkText.includes('cara kerja') || linkText.includes('kerja')) {
                        tabButtons[1].click(); // Activate "Cara Kerja"
                    } else if (linkText.includes('portofolio') || linkText.includes('karya')) {
                        tabButtons[3].click(); // Activate "Portofolio"
                    }
                }
            } else {
                // For other standard hash links (e.g. #faq), perform smooth scrolling
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });


    // ==========================================
    // 3. LIVE PRICE CALCULATOR (WOW FACTOR)
    // ==========================================
    const radioBasePackages = document.querySelectorAll('input[name="base-package"]');
    const checkboxAddOns = document.querySelectorAll('.calc-add-on');
    const calcSummaryList = document.getElementById('calc-summary-list');
    const calcTotalDisplay = document.getElementById('calc-total-display');
    const calcOrderBtn = document.getElementById('calc-order-btn');

    const updateCalculator = () => {
        let total = 0;
        let summaryHtml = '';
        let selectedBaseName = '';
        let selectedBasePrice = 0;

        // A. Get Selected Base Package
        radioBasePackages.forEach(radio => {
            if (radio.checked) {
                selectedBasePrice = parseInt(radio.value, 10);
                selectedBaseName = radio.dataset.name;
                total += selectedBasePrice;

                // Add to summary HTML
                summaryHtml += `
                    <div class="summary-item">
                        <strong>${selectedBaseName} (Dasar)</strong>
                        <span>${formatRupiah(selectedBasePrice)}</span>
                    </div>
                `;
            }
        });

        // B. Get Selected Add-ons
        checkboxAddOns.forEach(checkbox => {
            if (checkbox.checked) {
                const price = parseInt(checkbox.value, 10);
                const name = checkbox.dataset.name;
                total += price;

                // Add to summary HTML
                summaryHtml += `
                    <div class="summary-item">
                        <strong>+ ${name}</strong>
                        <span>${formatRupiah(price)}</span>
                    </div>
                `;
            }
        });

        // C. Update Display
        if (calcSummaryList) {
            calcSummaryList.innerHTML = summaryHtml || '<div class="summary-item">Belum ada pilihan</div>';
        }
        if (calcTotalDisplay) {
            calcTotalDisplay.textContent = formatRupiah(total);
        }
    };

    // Attach listeners to calculator inputs
    radioBasePackages.forEach(radio => radio.addEventListener('change', updateCalculator));
    checkboxAddOns.forEach(checkbox => checkbox.addEventListener('change', updateCalculator));

    // Initialize Calculator on load
    updateCalculator();

    // Handle Custom Calculator Ordering
    if (calcOrderBtn) {
        calcOrderBtn.addEventListener('click', () => {
            let selectedBaseName = '';
            let selectedBasePrice = 0;
            let addonsList = [];
            let total = 0;

            radioBasePackages.forEach(radio => {
                if (radio.checked) {
                    selectedBasePrice = parseInt(radio.value, 10);
                    selectedBaseName = radio.dataset.name;
                    total += selectedBasePrice;
                }
            });

            checkboxAddOns.forEach(checkbox => {
                if (checkbox.checked) {
                    const price = parseInt(checkbox.value, 10);
                    addonsList.push(checkbox.dataset.name);
                    total += price;
                }
            });

            // Create WhatsApp Message Body
            const phone = "6281234567890"; // Ganti dengan nomor WA Anda
            let message = `Halo Faza Web, saya tertarik ingin memesan *Paket Kustom* hasil rancangan saya sendiri di website:\n\n`;
            message += `*📦 Paket Dasar:* ${selectedBaseName} (${formatRupiah(selectedBasePrice)})\n`;
            
            if (addonsList.length > 0) {
                message += `*➕ Fitur Tambahan:*\n`;
                addonsList.forEach((addon, index) => {
                    message += `  ${index + 1}. ${addon}\n`;
                });
            } else {
                message += `*➕ Fitur Tambahan:* Tidak ada\n`;
            }
            
            message += `\n*💰 Total Estimasi:* *${formatRupiah(total)}*\n\n`;
            message += `Saya ingin berkonsultasi lebih lanjut untuk memproses pembuatan website ini. Terima kasih!`;

            // Encode and Redirect
            const encodedMessage = encodeURIComponent(message);
            const waUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
            window.open(waUrl, '_blank');
        });
    }


    // ==========================================
    // 4. FAQ ACCORDION MECHANICS
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle active state for clicked item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });


    // ==========================================
    // 5. CONSULTATION FORM & WHATSAPP INTEGRATION
    // ==========================================
    const consultForm = document.getElementById('consultation-form');

    if (consultForm) {
        consultForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Retrieve form values
            const name = document.getElementById('c-name').value.trim();
            const business = document.getElementById('c-business').value.trim();
            const type = document.getElementById('c-type').value;
            const userMessage = document.getElementById('c-message').value.trim();

            const phone = "6281234567890"; // Ganti dengan nomor WA Anda
            
            // Format elegant WhatsApp message
            let waMsg = `Halo Faza Web, saya ingin berkonsultasi mengenai pembuatan website bisnis saya. Berikut datanya:\n\n`;
            waMsg += `👤 *Nama Lengkap:* ${name}\n`;
            waMsg += `🏢 *Nama Usaha/Bisnis:* ${business}\n`;
            waMsg += `📋 *Pilihan Layanan:* ${type}\n`;
            
            if (userMessage) {
                waMsg += `💬 *Detail Keinginan:*\n"${userMessage}"\n`;
            } else {
                waMsg += `💬 *Detail Keinginan:* Ingin diskusi langsung mengenai konsep terbaik.\n`;
            }
            
            waMsg += `\nMohon dibantu rekomendasinya untuk langkah selanjutnya ya, terima kasih!`;

            // Encode message and open WhatsApp
            const encodedWaMsg = encodeURIComponent(waMsg);
            const finalWaUrl = `https://wa.me/${phone}?text=${encodedWaMsg}`;
            window.open(finalWaUrl, '_blank');
        });
    }

});
