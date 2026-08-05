// ================================================
// TOPBAR — Date & Language Slider
// ================================================

import { getCurrentLanguage } from '../utils/translator.js';

export function renderTopbar() {
  const currentLang = getCurrentLanguage();
  
  return `
    <div class="topbar">
      <div class="topbar-container">
        <div class="topbar-inner">
          <!-- Left: Dates -->
          <div class="topbar-dates">
            <span id="banglaDate" class="topbar-date bangla-text"></span>
            <span class="topbar-separator">|</span>
            <span id="englishDate" class="topbar-date"></span>
          </div>
          
          <!-- Right: Language Slider + Hidden Google Translate -->
          <div class="topbar-actions">
            <div class="lang-slider">
              <button class="lang-option ${currentLang === 'bn' ? 'active' : ''}" data-lang="bn" onclick="switchLanguage('bn')">
                <span class="flag">🇧🇩</span>
                <span class="lang-name bangla-text">বাংলা</span>
              </button>
              <button class="lang-option ${currentLang === 'en' ? 'active' : ''}" data-lang="en" onclick="switchLanguage('en')">
                <span class="flag">🇺🇸</span>
                <span class="lang-name">English</span>
              </button>
            </div>
            
            <!-- Hidden Google Translate Widget -->
            <div id="google_translate_element" style="display: none !important;"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}
