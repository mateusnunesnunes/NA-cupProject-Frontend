type AlbumItem = {
  owned: boolean;
  sticker: {
    country: string;
  };
};

type SummaryEntry = {
  country: string;
  flag: string;
  total: number;
  owned: number;
  missing: number;
  percent: number;
};

// Função que gera emoji de bandeira com base no código ISO
function getFlagEmoji(code: string): string {
  if (!code || code.length !== 2) return '🏳️';
  return code
    .toUpperCase()
    .split('')
    .map(char => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('');
}

// Mapeia nomes em português para códigos ISO (pode expandir conforme necessário)
const countryCodeMap: Record<string, string> = {
  Brazil: 'BR',
  Germany: 'DE',
  Argentina: 'AR',
  France: 'FR',
  Italy: 'IT',
  England: 'GB',
  Spain: 'ES',
  Portugal: 'PT',
  United_States: 'US',
  Japan: 'JP',
  South_Korea: 'KR',
  Netherlands: 'NL',
  Belgium: 'BE',
  Switzerland: 'CH',
  Uruguay: 'UY',
  Mexico: 'MX',
  Canada: 'CA',
  Chile: 'CL',
  Colombia: 'CO',
  Paraguay: 'PY',
  Peru: 'PE',
  Denmark: 'DK',
  Norway: 'NO',
  Sweden: 'SE',
  Finland: 'FI',
  Poland: 'PL',   
  Austria: 'AT',
  Croatia: 'HR',
  Serbia: 'RS',
  Turkey: 'TR',
  Greece: 'GR',
  Nigeria: 'NG',
  Ghana: 'GH',
  Senegal: 'SN',
  Cameroon: 'CM',
  Saudi_Arabia: 'SA',
  Qatar: 'QA',
  Australia: 'AU',
  New_Zealand: 'NZ',
  China: 'CN',
  Iran: 'IR',
  Morocco: 'MA',
  Tunisia: 'TN',
  Ecuador: 'EC',
  Wales: 'GB',
  Costa_Rica: 'CR'
};


export function summarizeAlbumItems(items: AlbumItem[]): SummaryEntry[] {
  const summary: Record<string, SummaryEntry> = {};

  items.forEach(({ owned, sticker }) => {
    const country = sticker?.country?.trim();
    if (!country) return;

    if (!summary[country]) {
      const iso = countryCodeMap[country] || 'UN';
      summary[country] = {
        country,
        flag: getFlagEmoji(iso),
        total: 0,
        owned: 0,
        missing: 0,
        percent: 0
      };
    }

    summary[country].total += 1;
    if (owned) summary[country].owned += 1;
  });

  for (const entry of Object.values(summary)) {
    entry.missing = entry.total - entry.owned;
    entry.percent = entry.total > 0 ? entry.owned / entry.total : 0;
  }

  return Object.values(summary);
}
