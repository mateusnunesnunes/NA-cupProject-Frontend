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
  Brasil: 'BR',
  Alemanha: 'DE',
  Argentina: 'AR',
  França: 'FR',
  Itália: 'IT',
  Inglaterra: 'GB',
  Espanha: 'ES',
  Portugal: 'PT',
  "Estados Unidos": 'US',
  Japão: 'JP',
  "Coreia do Sul": 'KR',
  Holanda: 'NL',
  Bélgica: 'BE',
  Suíça: 'CH',
  Uruguai: 'UY',
  México: 'MX',
  Canadá: 'CA',
  Chile: 'CL',
  Colômbia: 'CO',
  Paraguai: 'PY',
  Peru: 'PE',
  Dinamarca: 'DK',
  Noruega: 'NO',
  Suécia: 'SE',
  Finlândia: 'FI',
  Polônia: 'PL',
  Áustria: 'AT',
  Croácia: 'HR',
  Sérvia: 'RS',
  Turquia: 'TR',
  Grécia: 'GR',
  Nigéria: 'NG',
  Gana: 'GH',
  Senegal: 'SN',
  Camarões: 'CM',
  "Arábia Saudita": 'SA',
  Catar: 'QA',
  Austrália: 'AU',
  "Nova Zelândia": 'NZ',
  China: 'CN',
  Irã: 'IR',
  Marrocos: 'MA',
  Tunísia: 'TN'
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
