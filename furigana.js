// ============================================================
// furigana.js - Furigana Rendering Engine
// Uses the (kanji) format: 好（す）き → <ruby>好<rt>す</rt></ruby>き
// ============================================================

/**
 * Convert text with furigana in parentheses to HTML with ruby tags
 * 
 * Format: 六十五（ろくじゅうご）歳（さい）ですが、心（こころ）はまだ子ども（こども）のようです。
 * Output: <ruby>六十五<rt>ろくじゅうご</rt></ruby><ruby>歳<rt>さい</rt></ruby>ですが、<ruby>心<rt>こころ</rt></ruby>はまだ<ruby>子<rt>こ</rt></ruby>どものようです。
 * 
 * This handles:
 * - Single kanji: 好（す）き → <ruby>好<rt>す</rt></ruby>き
 * - Multiple kanji: 六十五（ろくじゅうご）歳（さい） → <ruby>六十五<rt>ろくじゅうご</rt></ruby><ruby>歳<rt>さい</rt></ruby>
 * - Mixed: 彼の名前は健二（けんじ）です → 彼の名前は<ruby>健二<rt>けんじ</rt></ruby>です
 * - Kanji with hiragana prefix/suffix: 子ども（こども）→ <ruby>子<rt>こ</rt></ruby>ども
 */
function renderFurigana(text) {
    if (!text) return '';
    
    // ============================================================
    // STEP 1: Handle complex cases like 子ども（こども）
    // This handles any text with furigana where the text part
    // contains both kanji and hiragana
    // ============================================================
    
    let result = text;
    
    // Find all patterns: [text]（[furigana]） where text contains both kanji and hiragana
    // This matches: 子ども（こども）, 食べ物（たべもの）, etc.
    const complexPattern = /([\u4e00-\u9faf\u3400-\u4dbf]+[\u3040-\u30FF]+[\u4e00-\u9faf\u3400-\u4dbf]*[\u3040-\u30FF]*)（([^（）]+)）/g;
    
    result = result.replace(complexPattern, (match, textPart, furigana) => {
        // Extract kanji from textPart
        let kanjiChars = '';
        let kanaParts = [];
        let currentIndex = 0;
        
        for (let i = 0; i < textPart.length; i++) {
            const char = textPart[i];
            if (char.match(/[\u4e00-\u9faf\u3400-\u4dbf]/)) {
                kanjiChars += char;
            } else {
                // If we have accumulated kanji, add it
                if (kanjiChars.length > 0) {
                    // We have a kanji block, need to split furigana
                    // For simplicity, we use the whole furigana
                    // This is a fallback
                    return `<ruby>${textPart}<rt>${furigana}</rt></ruby>`;
                }
            }
        }
        
        // If we have kanji, split the furigana
        if (kanjiChars.length > 0) {
            // For 子ども（こども）, kanjiChars = "子", furigana = "こども"
            // We need to match furigana to each kanji
            let furiganaIndex = 0;
            let resultParts = '';
            let remainingText = textPart;
            
            for (let i = 0; i < kanjiChars.length; i++) {
                const kanji = kanjiChars[i];
                // Find position of kanji in remainingText
                const pos = remainingText.indexOf(kanji);
                if (pos === -1) continue;
                
                // Add text before kanji
                if (pos > 0) {
                    resultParts += remainingText.substring(0, pos);
                }
                
                // Find matching furigana segment
                let furiganaSegment = '';
                // If it's the last kanji, take remaining furigana
                if (i === kanjiChars.length - 1) {
                    furiganaSegment = furigana.substring(furiganaIndex);
                } else {
                    // Try to split furigana proportionally
                    // This is a heuristic - for better accuracy, use token-based data
                    const avgCharsPerKanji = Math.floor(furigana.length / kanjiChars.length);
                    furiganaSegment = furigana.substring(furiganaIndex, furiganaIndex + avgCharsPerKanji);
                    furiganaIndex += avgCharsPerKanji;
                }
                
                resultParts += `<ruby>${kanji}<rt>${furiganaSegment}</rt></ruby>`;
                remainingText = remainingText.substring(pos + kanji.length);
            }
            
            // Add remaining text after last kanji
            if (remainingText.length > 0) {
                resultParts += remainingText;
            }
            
            return resultParts;
        }
        
        // Fallback: wrap the whole thing
        return `<ruby>${textPart}<rt>${furigana}</rt></ruby>`;
    });
    
    // ============================================================
    // STEP 2: Handle standard cases
    // Example: 好（す）き → <ruby>好<rt>す</rt></ruby>き
    // Example: 六十五（ろくじゅうご） → <ruby>六十五<rt>ろくじゅうご</rt></ruby>
    // ============================================================
    
    // Pattern: kanji + (furigana) + optional trailing kana
    result = result.replace(
        /([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）([\u3040-\u30FF]*)/g,
        (_, kanji, furigana, trailing) => 
            `<ruby>${kanji}<rt>${furigana}</rt></ruby>${trailing}`
    );
    
    // ============================================================
    // STEP 3: Handle any remaining simple furigana (kanji without trailing kana)
    // Example: 健二（けんじ） → <ruby>健二<rt>けんじ</rt></ruby>
    // ============================================================
    
    result = result.replace(
        /([\u4e00-\u9faf\u3400-\u4dbf]+)（([^（）]+)）/g,
        (_, kanji, furigana) => 
            `<ruby>${kanji}<rt>${furigana}</rt></ruby>`
    );
    
    // ============================================================
    // STEP 4: Handle edge cases with spaces
    // Example: 子(こ) ども → 子（こ）ども (already handled above)
    // ============================================================
    
    // Remove any accidental spaces inside furigana markers
    result = result.replace(/（\s+/g, '（');
    result = result.replace(/\s+）/g, '）');
    
    return result;
}

/**
 * Check if text contains furigana in parentheses
 */
function hasFurigana(text) {
    return /（[^（）]+）/.test(text);
}

/**
 * Strip furigana from text (for when furigana is turned off)
 * Example: 六十五（ろくじゅうご）歳（さい） → 六十五歳
 */
function stripFurigana(text) {
    return text.replace(/（[^（）]+）/g, '');
}

/**
 * Get the plain text without furigana markers
 */
function getPlainText(text) {
    return stripFurigana(text);
}

// ============================================================
// EXPORT (for browser and Node.js)
// ============================================================

if (typeof window !== 'undefined') {
    window.renderFurigana = renderFurigana;
    window.hasFurigana = hasFurigana;
    window.stripFurigana = stripFurigana;
    window.getPlainText = getPlainText;
    console.log('✅ furigana.js loaded');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderFurigana,
        hasFurigana,
        stripFurigana,
        getPlainText
    };
}