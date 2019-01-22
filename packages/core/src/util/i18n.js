const map = {
    'not_support': {
        'zh-Hans': '此版本不支持GScatter，至少需要2.0.3版本',
        'en': 'not support GScatter in this version, at least 2.0.3',
        'ko': '이 버전은 GScatter를 지원하지 않습니다. 2.0.3 이상이 필요합니다.',
    }
}

export default function i18n(key, lang) {
    return map[key][lang] || map[key]['en']
}