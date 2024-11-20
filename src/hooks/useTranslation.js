import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

class Testtran extends Component {
  switchingLanguage = () => {
    const { i18n } = this.props;
    // Toggle between English (en) and Thai (th)
    const newLanguage = i18n.language === "en" ? "th" : "en";
    i18n.changeLanguage(newLanguage);
  };

  render() {
    const { t } = this.props; // Extract `t` for translation
    return (
      <div>
        <h1>{t('welcome')}</h1> {/* Translate "welcome" */}
        <p>{t('description')}</p> {/* Translate "description" */}
        <button onClick={this.switchingLanguage}>
          {t('switch_language')}
        </button>
      </div>
    );
  }
}

export default withTranslation()(Testtran);
