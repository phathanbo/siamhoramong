import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # 1. Fix SVG Chart (Item 1)
    content = content.replace(
        '<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="#f1c40f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
        '<img src="data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'45\' height=\'45\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23f1c40f\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><polyline points=\'22 12 18 12 15 21 9 3 6 12 2 12\'></polyline></svg>" style="width:45px; height:45px; border:none; outline:none;" />'
    )
    
    # 2. Fix SVG Money (Item 2)
    content = content.replace(
        '<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="18" x2="12" y2="22"></line><line x1="12" y1="2" x2="12" y2="6"></line></svg>',
        '<img src="data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'45\' height=\'45\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23fff\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><circle cx=\'12\' cy=\'12\' r=\'10\'></circle><path d=\'M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8\'></path><line x1=\'12\' y1=\'18\' x2=\'12\' y2=\'22\'></line><line x1=\'12\' y1=\'2\' x2=\'12\' y2=\'6\'></line></svg>" style="width:45px; height:45px; border:none; outline:none;" />'
    )
    
    # 3. Fix SVG Shield (Item 3)
    content = content.replace(
        '<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
        '<img src="data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'45\' height=\'45\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23fff\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><path d=\'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\'></path></svg>" style="width:45px; height:45px; border:none; outline:none;" />'
    )
    
    # 4. Fix SVG Sun (Tip 1)
    content = content.replace(
        '<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
        '<img src="data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'45\' height=\'45\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23fff\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><circle cx=\'12\' cy=\'12\' r=\'5\'></circle><line x1=\'12\' y1=\'1\' x2=\'12\' y2=\'3\'></line><line x1=\'12\' y1=\'21\' x2=\'12\' y2=\'23\'></line><line x1=\'4.22\' y1=\'4.22\' x2=\'5.64\' y2=\'5.64\'></line><line x1=\'18.36\' y1=\'18.36\' x2=\'19.78\' y2=\'19.78\'></line><line x1=\'1\' y1=\'12\' x2=\'3\' y2=\'12\'></line><line x1=\'21\' y1=\'12\' x2=\'23\' y2=\'12\'></line><line x1=\'4.22\' y1=\'19.78\' x2=\'5.64\' y2=\'18.36\'></line><line x1=\'18.36\' y1=\'5.64\' x2=\'19.78\' y2=\'4.22\'></line></svg>" style="width:45px; height:45px; border:none; outline:none;" />'
    )
    
    # 5. Fix SVG Flame (Tip 2)
    content = content.replace(
        '<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>',
        '<img src="data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'45\' height=\'45\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23fff\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><path d=\'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\'></path></svg>" style="width:45px; height:45px; border:none; outline:none;" />'
    )
    
    # 6. Fix SVG Leaf (Tip 3)
    content = content.replace(
        '<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>',
        '<img src="data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'45\' height=\'45\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23fff\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><path d=\'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z\'></path><path d=\'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\'></path></svg>" style="width:45px; height:45px; border:none; outline:none;" />'
    )

    # 7. Fix Top Left SVG
    content = content.replace(
        '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#d4af37" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
        '<img src="data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 24 24\' fill=\'%23d4af37\' stroke=\'%23d4af37\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><polygon points=\'12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\'></polygon></svg>" style="width:40px; height:40px; border:none; outline:none;" />'
    )

    # Replace borders with wrappers in left column
    content = content.replace(
        '<div style="display: flex; align-items: center; margin-bottom: 30px; background-color: #ffffff; padding: 15px; border-radius: 20px; border: 1px solid #e0e0e0;">',
        '<div style="margin-bottom: 30px; background-color: #e0e0e0; padding: 1px; border-radius: 20px;"><div style="display: flex; align-items: center; background-color: #ffffff; padding: 15px; border-radius: 19px;">'
    )
    content = content.replace(
        '<div style="display: flex; align-items: center; background-color: #ffffff; padding: 15px; border-radius: 20px; border: 1px solid #e0e0e0;">',
        '<div style="background-color: #e0e0e0; padding: 1px; border-radius: 20px;"><div style="display: flex; align-items: center; background-color: #ffffff; padding: 15px; border-radius: 19px;">'
    )
    # Fix the closing tags for left column
    # They are just before `<div style="margin-left: 20px;">` block ends... Wait, the easiest way is to find the closing div of that item.
    # It's safer to do this manually or via regex.
    content = re.sub(
        r'(<div style="font-size: 17px; color: #555; line-height: 1.4;">.*?</div>\s*</div>\s*)</div>',
        r'\1</div></div>',
        content,
        flags=re.DOTALL
    )
    # the Warning item closing
    content = re.sub(
        r'(<div style="font-size: 17px; color: #555; line-height: 1.4; display: flex; flex-direction: column; gap: 5px;">.*?</div>\s*</div>\s*)</div>',
        r'\1</div></div>',
        content,
        flags=re.DOTALL
    )

    # Fix circles in left column
    content = content.replace(
        '<div style="width: 100px; height: 100px; border-radius: 50%; background-color: #2c3e50; border: 4px solid #d4af37; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">',
        '<div style="width: 100px; height: 100px; border-radius: 50%; background-color: #d4af37; padding: 4px; display: flex; justify-content: center; align-items: center; flex-shrink: 0; box-sizing: border-box;"><div style="width: 100%; height: 100%; border-radius: 50%; background-color: #2c3e50; display: flex; justify-content: center; align-items: center;">'
    )
    content = content.replace(
        '<div style="width: 100px; height: 100px; border-radius: 50%; background-color: #27ae60; border: 4px solid #d4af37; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">',
        '<div style="width: 100px; height: 100px; border-radius: 50%; background-color: #d4af37; padding: 4px; display: flex; justify-content: center; align-items: center; flex-shrink: 0; box-sizing: border-box;"><div style="width: 100%; height: 100%; border-radius: 50%; background-color: #27ae60; display: flex; justify-content: center; align-items: center;">'
    )
    content = content.replace(
        '<div style="width: 100px; height: 100px; border-radius: 50%; background-color: #c0392b; border: 4px solid #d4af37; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">',
        '<div style="width: 100px; height: 100px; border-radius: 50%; background-color: #d4af37; padding: 4px; display: flex; justify-content: center; align-items: center; flex-shrink: 0; box-sizing: border-box;"><div style="width: 100%; height: 100%; border-radius: 50%; background-color: #c0392b; display: flex; justify-content: center; align-items: center;">'
    )
    
    # Close circle inner div
    content = content.replace('</div>\n                        <div style="margin-left: 20px;">', '</div></div>\n                        <div style="margin-left: 20px;">')
    content = content.replace('</div>\n                              <div style="margin-left: 20px;">', '</div></div>\n                              <div style="margin-left: 20px;">')

    # Fix circles in right column (Tips)
    content = content.replace(
        '<div style="width: 90px; height: 90px; border-radius: 50%; background-color: #f39c12; border: 4px solid #fff; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">',
        '<div style="width: 90px; height: 90px; border-radius: 50%; background-color: #fff; padding: 4px; display: flex; justify-content: center; align-items: center; flex-shrink: 0; box-sizing: border-box;"><div style="width: 100%; height: 100%; border-radius: 50%; background-color: #f39c12; display: flex; justify-content: center; align-items: center;">'
    )
    content = content.replace(
        '<div style="width: 90px; height: 90px; border-radius: 50%; background-color: #d35400; border: 4px solid #fff; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">',
        '<div style="width: 90px; height: 90px; border-radius: 50%; background-color: #fff; padding: 4px; display: flex; justify-content: center; align-items: center; flex-shrink: 0; box-sizing: border-box;"><div style="width: 100%; height: 100%; border-radius: 50%; background-color: #d35400; display: flex; justify-content: center; align-items: center;">'
    )
    content = content.replace(
        '<div style="width: 90px; height: 90px; border-radius: 50%; background-color: #8e44ad; border: 4px solid #fff; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">',
        '<div style="width: 90px; height: 90px; border-radius: 50%; background-color: #fff; padding: 4px; display: flex; justify-content: center; align-items: center; flex-shrink: 0; box-sizing: border-box;"><div style="width: 100%; height: 100%; border-radius: 50%; background-color: #8e44ad; display: flex; justify-content: center; align-items: center;">'
    )
    
    # Close tip circle inner div
    content = re.sub(
        r'</div>\s*<div style="margin-left: -20px; background-color: #ffffff; border: 2px solid',
        r'</div></div>\n                        <div style="margin-left: -20px; background-color: #ffffff; border: 2px solid',
        content
    )

    # Fix right column pill boxes border
    content = content.replace(
        'border: 2px solid #f39c12; border-radius: 50px; padding: 10px 20px 10px 30px;',
        'border: none; outline: 2px solid #f39c12; outline-offset: -2px; border-radius: 50px; padding: 10px 20px 10px 30px;'
    )
    content = content.replace(
        'border: 2px solid #e74c3c; border-radius: 50px; padding: 10px 20px 10px 30px;',
        'border: none; outline: 2px solid #e74c3c; outline-offset: -2px; border-radius: 50px; padding: 10px 20px 10px 30px;'
    )
    content = content.replace(
        'border: 2px solid #8e44ad; border-radius: 50px; padding: 10px 20px 10px 30px;',
        'border: none; outline: 2px solid #8e44ad; outline-offset: -2px; border-radius: 50px; padding: 10px 20px 10px 30px;'
    )
    
    # Fix colors pill border
    content = re.sub(
        r'border: 1px solid rgba\(0,0,0,0.1\);',
        r'border: none; outline: 1px solid rgba(0,0,0,0.1); outline-offset: -1px;',
        content
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed {filepath}")

fix_file('d:/สยามโหรามงคล/adminWeeklyFortune.js')
fix_file('d:/สยามโหรามงคล/adminContentGenerator.js')
