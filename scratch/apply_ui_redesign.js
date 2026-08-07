const fs = require('fs');
const path = require('path');

const horasatPath = path.join(__dirname, '..', 'Horasat.html');
let html = fs.readFileSync(horasatPath, 'utf8');

// Replace styles with luxury cosmic glassmorphism UI
const newStyles = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        @media print {
            @page {
                size: A4;
                margin: 1.5cm;
            }
            body {
                background: #0d0a1a !important;
                color: #e9dcc8 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                padding: 0 !important;
            }
            .form-card, .back-btn, #calcBtn, #printBtn, #saveImgBtn, .no-print, .filter-tabs {
                display: none !important;
            }
            .container {
                box-shadow: none !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                background: transparent !important;
            }
            #chartTable {
                display: block !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                margin-bottom: 20px !important;
            }
            .accordion-content {
                display: block !important;
                opacity: 1 !important;
                visibility: visible !important;
                animation: none !important;
                height: auto !important;
            }
            .accordion-icon, .hide-on-export {
                display: none !important;
            }
            .prediction-grid {
                display: block !important;
            }
            .birth-card {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                display: block !important;
                width: 100% !important;
                margin-bottom: 12px !important;
                border: 1px solid rgba(212, 175, 55, 0.4) !important;
                background: rgba(255, 255, 255, 0.04) !important;
            }
            .prediction-section {
                page-break-inside: auto !important;
                margin-bottom: 25px !important;
                padding: 15px !important;
                border: 1px solid rgba(255, 216, 138, 0.3) !important;
            }
            h1, h2, h3, h4, h5 {
                page-break-after: avoid !important;
                margin-top: 0 !important;
            }
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Sarabun', 'Outfit', sans-serif;
            background: radial-gradient(circle at 50% 0%, #1c0d38 0%, #0c061a 50%, #05020c 100%);
            color: #f7eedd;
            min-height: 100vh;
            padding: 24px 16px 60px;
            overflow-x: hidden;
        }

        /* Animated Ambient Nebula Glow */
        body::before {
            content: '';
            position: fixed;
            top: -200px;
            left: 50%;
            transform: translateX(-50%);
            width: 800px;
            height: 600px;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(138, 43, 226, 0.1) 40%, transparent 70%);
            pointer-events: none;
            z-index: 0;
            filter: blur(80px);
        }

        .container {
            max-width: 1080px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }

        .back-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #ffd88a;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 216, 138, 0.25);
            padding: 8px 18px;
            border-radius: 30px;
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 500;
            transition: all 0.3s ease;
            backdrop-filter: blur(8px);
        }
        
        .back-btn:hover {
            background: rgba(255, 216, 138, 0.15);
            color: #fff;
            transform: translateX(-4px);
            box-shadow: 0 0 15px rgba(255, 216, 138, 0.3);
        }

        .header-banner {
            text-align: center;
            margin: 15px 0 30px;
        }

        .header-banner h1 {
            font-size: 2.3rem;
            font-weight: 700;
            background: linear-gradient(135deg, #fff 0%, #ffd88a 50%, #d4af37 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .header-banner .subtitle {
            color: #bfa8e6;
            font-size: 1.1rem;
            font-weight: 300;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            flex-wrap: wrap;
        }

        .tag-badge {
            background: rgba(212, 175, 55, 0.12);
            border: 1px solid rgba(212, 175, 55, 0.3);
            color: #ffd88a;
            padding: 3px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
        }

        /* Glassmorphism Control Panel */
        .form-card {
            background: rgba(24, 15, 45, 0.65);
            border: 1px solid rgba(255, 216, 138, 0.25);
            border-radius: 24px;
            padding: 28px;
            max-width: 720px;
            margin: 0 auto 30px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(255, 216, 138, 0.05);
            backdrop-filter: blur(16px);
            position: relative;
        }

        .form-row {
            display: flex;
            flex-wrap: wrap;
            gap: 18px;
            margin-bottom: 18px;
        }

        .form-row label {
            display: flex;
            flex-direction: column;
            font-size: 0.95rem;
            color: #e5d7fa;
            gap: 8px;
            flex: 1;
            min-width: 140px;
            font-weight: 500;
        }

        .form-row input,
        .form-row select {
            background: rgba(10, 5, 22, 0.8);
            border: 1px solid rgba(255, 216, 138, 0.3);
            border-radius: 12px;
            color: #f7eedd;
            padding: 12px 14px;
            font-family: inherit;
            font-size: 1rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .form-row input:focus, .form-row select:focus {
            outline: none;
            border-color: #ffd88a;
            box-shadow: 0 0 15px rgba(255, 216, 138, 0.4);
            background: rgba(18, 9, 40, 0.95);
        }

        button.main-action-btn {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 14px;
            background: linear-gradient(135deg, #ffd88a 0%, #d4af37 50%, #b8860b 100%);
            color: #120826;
            font-weight: 700;
            font-size: 1.15rem;
            cursor: pointer;
            font-family: inherit;
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(212, 175, 55, 0.35);
            margin-top: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        button.main-action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(212, 175, 55, 0.55);
            filter: brightness(1.08);
        }

        .action-btn-group {
            display: flex;
            gap: 12px;
            margin-top: 15px;
        }

        .action-btn {
            flex: 1;
            border: none;
            padding: 12px;
            font-size: 0.95rem;
            font-weight: 600;
            border-radius: 12px;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-green {
            background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
            border: 1px solid rgba(76, 175, 80, 0.4);
            box-shadow: 0 6px 20px rgba(46, 125, 50, 0.3);
        }
        .btn-green:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(76, 175, 80, 0.5);
        }

        .btn-blue {
            background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
            border: 1px solid rgba(33, 150, 243, 0.4);
            box-shadow: 0 6px 20px rgba(21, 101, 192, 0.3);
        }
        .btn-blue:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(33, 150, 243, 0.5);
        }

        /* Birth Card Summary */
        .birth-card {
            background: rgba(30, 20, 55, 0.7);
            border: 1px solid rgba(255, 216, 138, 0.3);
            border-radius: 18px;
            padding: 20px 26px;
            max-width: 640px;
            margin: 0 auto 30px;
            font-size: 1.02rem;
            line-height: 1.7;
            color: #f7eedd;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(12px);
        }

        .birth-card b {
            color: #ffd88a;
        }

        /* Wheel & Table Layout */
        .layout {
            display: flex;
            flex-wrap: wrap;
            gap: 32px;
            justify-content: center;
            align-items: center;
            background: rgba(20, 12, 38, 0.6);
            border: 1px solid rgba(255, 216, 138, 0.2);
            border-radius: 24px;
            padding: 28px;
            margin-bottom: 35px;
            backdrop-filter: blur(14px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
        }

        .wheel-wrap {
            background: rgba(10, 5, 20, 0.8);
            border: 1px solid rgba(255, 216, 138, 0.25);
            border-radius: 24px;
            padding: 16px;
            box-shadow: 0 0 30px rgba(0,0,0,0.8);
        }

        table.chart-table {
            border-collapse: collapse;
            font-size: 0.95rem;
            min-width: 320px;
        }

        table.chart-table th,
        table.chart-table td {
            padding: 10px 14px;
            text-align: left;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        table.chart-table th {
            color: #ffd88a;
            font-weight: 600;
            font-size: 0.9rem;
            letter-spacing: 0.5px;
            border-bottom: 2px solid rgba(255, 216, 138, 0.25);
        }

        /* Filter Tabs */
        .filter-tabs {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            padding-bottom: 10px;
            margin-bottom: 20px;
            scrollbar-width: thin;
        }

        .filter-tab {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 216, 138, 0.2);
            color: #d1c4e9;
            padding: 8px 18px;
            border-radius: 25px;
            font-size: 0.9rem;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.3s ease;
            font-family: inherit;
        }

        .filter-tab:hover, .filter-tab.active {
            background: rgba(255, 216, 138, 0.2);
            border-color: #ffd88a;
            color: #fff;
            box-shadow: 0 0 15px rgba(255, 216, 138, 0.3);
        }

        /* Prediction Accordion Sections */
        .prediction-section {
            background: rgba(22, 14, 42, 0.7);
            border: 1px solid rgba(255, 216, 138, 0.2);
            border-radius: 20px;
            padding: 22px;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(14px);
            transition: all 0.3s ease;
        }

        .prediction-section:hover {
            border-color: rgba(255, 216, 138, 0.35);
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.55);
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 216, 138, 0.12);
            padding: 12px 14px;
            border-radius: 12px;
            cursor: pointer;
            transition: background 0.25s ease;
        }
        
        .section-header:hover {
            background: rgba(255, 216, 138, 0.08);
        }
        
        .section-header.active {
            background: rgba(255, 216, 138, 0.12);
            border-bottom-color: rgba(255, 216, 138, 0.3);
        }

        .section-header h3 {
            margin: 0;
            font-size: 1.15rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 12px;
            color: #ffd88a;
        }

        .export-btn-sm {
            background: linear-gradient(135deg, #e65100 0%, #bf360c 100%);
            border: 1px solid rgba(255, 112, 67, 0.4);
            border-radius: 10px;
            padding: 6px 14px;
            color: white;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 500;
            transition: all 0.25s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .export-btn-sm:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(230, 81, 0, 0.5);
        }

        footer {
            text-align: center;
            color: #8c7aa3;
            font-size: 0.85rem;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
    </style>
`;

// Replace existing style block in html
html = html.replace(/<style>[\s\S]*?<\/style>/i, newStyles);

fs.writeFileSync(horasatPath, html, 'utf8');
console.log("Successfully updated Horasat.html with luxury UI!");
