// src/screens/Album/AlbumHome.tsx
import React, { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Line } from 'react-native-svg';

const TOTAL_GRUPOS = 12;

interface Jogo {
  id: string;
  timeA: string;
  timeB: string;
  golsA: string;
  golsB: string;
}

interface Estatistica {
  nome: string;
  pontos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  saldoGols: number;
  golsPro: number;
  golsContra: number;
  partidas: number;
  aproveitamento: string;
}

interface Grupo {
  id: number;
  jogos: Jogo[];
  tabela: Estatistica[];
}

const gerarTimesDoGrupo = (grupoIndex: number): string[] =>
  [`Time ${grupoIndex}A`, `Time ${grupoIndex}B`, `Time ${grupoIndex}C`, `Time ${grupoIndex}D`];

const gerarJogosDoGrupo = (grupoIndex: number): Jogo[] => {
  const times = gerarTimesDoGrupo(grupoIndex);
  const jogos: Jogo[] = [];
  for (let i = 0; i < times.length; i++) {
    for (let j = i + 1; j < times.length; j++) {
      jogos.push({
        id: `${grupoIndex}-${i}-${j}`,
        timeA: times[i],
        timeB: times[j],
        golsA: '',
        golsB: '',
      });
    }
  }
  return jogos;
};

const calcularTabela = (jogos: Jogo[], grupoIndex: number): Estatistica[] => {
  const estatisticas: { [key: string]: Estatistica } = {};

  gerarTimesDoGrupo(grupoIndex).forEach((time) => {
    estatisticas[time] = {
      nome: time,
      pontos: 0,
      vitorias: 0,
      empates: 0,
      derrotas: 0,
      saldoGols: 0,
      golsPro: 0,
      golsContra: 0,
      partidas: 0,
      aproveitamento: '0.0',
    };
  });

  jogos.forEach((jogo) => {
    if (jogo.golsA !== '' && jogo.golsB !== '') {
      const golsA = parseInt(jogo.golsA, 10);
      const golsB = parseInt(jogo.golsB, 10);

      const timeA = estatisticas[jogo.timeA];
      const timeB = estatisticas[jogo.timeB];

      timeA.golsPro += golsA;
      timeA.golsContra += golsB;
      timeB.golsPro += golsB;
      timeB.golsContra += golsA;

      timeA.partidas++;
      timeB.partidas++;

      if (golsA > golsB) {
        timeA.vitorias++;
        timeA.pontos += 3;
        timeB.derrotas++;
      } else if (golsA < golsB) {
        timeB.vitorias++;
        timeB.pontos += 3;
        timeA.derrotas++;
      } else {
        timeA.empates++;
        timeB.empates++;
        timeA.pontos += 1;
        timeB.pontos += 1;
      }
    }
  });

  const tabelaFinal: Estatistica[] = Object.values(estatisticas).map((time) => {
    const aproveitamento = time.partidas
      ? ((time.pontos / (time.partidas * 3)) * 100).toFixed(1)
      : '0.0';
    return {
      ...time,
      saldoGols: time.golsPro - time.golsContra,
      aproveitamento,
    };
  });

  tabelaFinal.sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    return b.saldoGols - a.saldoGols;
  });

  return tabelaFinal;
};

const criarGruposIniciais = (): Grupo[] => {
  return Array.from({ length: TOTAL_GRUPOS }, (_, i) => {
    const jogos = gerarJogosDoGrupo(i + 1);
    const tabela = calcularTabela(jogos, i + 1);
    return {
      id: i + 1,
      jogos,
      tabela,
    };
  });
};

////////////////////////////////////////////////// MATA-MATA ///////////////////////////////////////////////////////

const { width } = Dimensions.get('window');
//const { height } = Dimensions.get('window');
const CARD_WIDTH = 140;
const CARD_HEIGHT = 100;

interface Game {
  date: string;
  teams: [string, string];
  title?: string;
}

interface MatchCardProps extends Game {}

const games: {
  oitavasEsq: Game[];
  quartasEsq: Game[];
  semiEsq: Game[];
  oitavasDir: Game[];
  quartasDir: Game[];
  semiDir: Game[];
  final: Game[];
  terceiroLugar: Game[];
} = {
      oitavasEsq: [
        { date: '03/12/22 - 12:00', teams: ['1° Grupo A', '2° Grupo B'] },
        { date: '03/12/22 - 16:00', teams: ['1° Grupo C', '2° Grupo D'] },
        { date: '05/12/22 - 12:00', teams: ['1° Grupo E', '2° Grupo F'] },
        { date: '05/12/22 - 16:00', teams: ['1° Grupo G', '2° Grupo H'] },
      ],
      quartasEsq: [
        { date: '09/12/22 - 16:00', teams: ['Oitavas 1', 'Oitavas 2'] },
        { date: '09/12/22 - 12:00', teams: ['Oitavas 3', 'Oitavas 4'] },
      ],
      semiEsq: [{ date: '13/12/22 - 16:00', teams: ['Quartas 1', 'Quartas 2'] }],

      oitavasDir: [
        { date: '04/12/22 - 16:00', teams: ['1° Grupo B', '2° Grupo A'] },
        { date: '04/12/22 - 12:00', teams: ['1° Grupo D', '2° Grupo C'] },
        { date: '06/12/22 - 12:00', teams: ['1° Grupo F', '2° Grupo E'] },
        { date: '06/12/22 - 16:00', teams: ['1° Grupo H', '2° Grupo G'] },
      ],
      quartasDir: [
        { date: '10/12/22 - 16:00', teams: ['Oitavas 5', 'Oitavas 6'] },
        { date: '10/12/22 - 12:00', teams: ['Oitavas 7', 'Oitavas 8'] },
      ],
      semiDir: [{ date: '14/12/22 - 16:00', teams: ['Quartas 3', 'Quartas 4'] }],

      final: [{ date: '18/12/22 - 12:00', teams: ['Semi-Final 1', 'Semi-Final 2'], title: 'FINAL' }],
      terceiroLugar: [{ date: '17/12/22 - 12:00', teams: ['Semi-Final 1', 'Semi-Final 2'], title: '3º LUGAR' }],
    };

const MatchCard: React.FC<MatchCardProps> = ({ date, teams, title }) => (
  <View style={styles.card}>
    <Text style={styles.date}>{date}</Text>
    <Text style={styles.team}>{teams[0]}</Text>
    <Text style={styles.team}>{teams[1]}</Text>
    {title && <Text style={styles.title}>{title}</Text>}
  </View>
);

const TabelaScreen: React.FC = () => {
  const [modoVisualizacao, setModoVisualizacao] = useState<'tabela' | 'mata-mata'>('tabela');
  const [grupos, setGrupos] = useState<Grupo[]>(criarGruposIniciais());

  const atualizarGols = (grupoId: number, jogoId: string, campo: 'golsA' | 'golsB', valor: string) => {
    const novosGrupos = grupos.map((grupo) => {
      if (grupo.id === grupoId) {
        const novosJogos = grupo.jogos.map((jogo) =>
          jogo.id === jogoId ? { ...jogo, [campo]: valor.replace(/[^0-9]/g, '') } : jogo
        );
        const novaTabela = calcularTabela(novosJogos, grupo.id);
        return { ...grupo, jogos: novosJogos, tabela: novaTabela };
      }
      return grupo;
    });
    setGrupos(novosGrupos);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topButtons}>
        <Text
          style={[styles.toggleButton, modoVisualizacao === 'tabela' && styles.activeButton]}
          onPress={() => setModoVisualizacao('tabela')}
        >
          Fase de Grupos
        </Text>
        <Text
          style={[styles.toggleButton, modoVisualizacao === 'mata-mata' && styles.activeButton]}
          onPress={() => setModoVisualizacao('mata-mata')}
        >
          Mata-mata
        </Text>
      </View>

      <ScrollView>
        {modoVisualizacao === 'tabela' ? (
          grupos.map((grupo) => (
            <View key={grupo.id} style={styles.grupoContainer}>
              <Text style={styles.titulo}>Grupo {grupo.id}</Text>

              <View style={styles.header}>
                <Text style={[styles.cell, styles.headerCell]}>#</Text>
                <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>Time</Text>
                <Text style={[styles.cell, styles.headerCell]}>Pts</Text>
                <Text style={[styles.cell, styles.headerCell]}>J</Text>
                <Text style={[styles.cell, styles.headerCell]}>V</Text>
                <Text style={[styles.cell, styles.headerCell]}>E</Text>
                <Text style={[styles.cell, styles.headerCell]}>D</Text>
                <Text style={[styles.cell, styles.headerCell]}>SG</Text>
                <Text style={[styles.cell, styles.headerCell]}>%</Text>
              </View>

              {grupo.tabela.map((item, index) => (
                <View key={item.nome} style={styles.row}>
                  <Text style={styles.cell}>{index + 1}</Text>
                  <Text style={[styles.cell, { flex: 2 }]}>{item.nome}</Text>
                  <Text style={styles.cell}>{item.pontos}</Text>
                  <Text style={styles.cell}>{item.partidas}</Text>
                  <Text style={styles.cell}>{item.vitorias}</Text>
                  <Text style={styles.cell}>{item.empates}</Text>
                  <Text style={styles.cell}>{item.derrotas}</Text>
                  <Text style={styles.cell}>{item.saldoGols}</Text>
                  <Text style={styles.cell}>{item.aproveitamento}%</Text>
                </View>
              ))}

              <View style={styles.jogosGrid}>
                {grupo.jogos.map((jogo) => (
                  <View key={jogo.id} style={styles.jogoCard}>
                    <Text style={styles.jogoTimes}>{jogo.timeA}</Text>
                    <View style={styles.jogoPlacar}>
                      <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={jogo.golsA}
                        onChangeText={(valor) => atualizarGols(grupo.id, jogo.id, 'golsA', valor)}
                      />
                      <Text style={{ marginHorizontal: 4 }}>x</Text>
                      <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={jogo.golsB}
                        onChangeText={(valor) => atualizarGols(grupo.id, jogo.id, 'golsB', valor)}
                      />
                    </View>
                    <Text style={styles.jogoTimes}>{jogo.timeB}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.container}>
            <ScrollView horizontal contentContainerStyle={styles.bracketContainer}>
              <View style={styles.column}>
                {games.oitavasEsq.map((game, idx) => (
                  <MatchCard key={`oitavasEsq-${idx}`} {...game} />
                ))}
              </View>

              <Svg height="100%" width={50}>
                <Line x1="0" y1="65" x2="25" y2="65" stroke="black" strokeWidth="1.5" />
                <Line x1="25" y1="65" x2="25" y2="135" stroke="black" strokeWidth="1.5" />

                <Line x1="25" y1="135" x2="50" y2="135" stroke="black" strokeWidth="1.5" />

                <Line x1="0" y1="195" x2="25" y2="195" stroke="black" strokeWidth="1.5" />
                <Line x1="25" y1="195" x2="25" y2="135" stroke="black" strokeWidth="1.5" />

                <Line x1="0" y1="325" x2="25" y2="325" stroke="black" strokeWidth="1.5" />
                <Line x1="25" y1="325" x2="25" y2="390" stroke="black" strokeWidth="1.5" />

                <Line x1="25" y1="390" x2="50" y2="390" stroke="black" strokeWidth="1.5" />
                
                <Line x1="0" y1="455" x2="25" y2="455" stroke="black" strokeWidth="1.5" />
                <Line x1="25" y1="455" x2="25" y2="390" stroke="black" strokeWidth="1.5" />
              </Svg>

              <View style={styles.columnQuartas}>
                {games.quartasEsq.map((game, idx) => (
                  <MatchCard key={`quartasEsq-${idx}`} {...game} />
                ))}
              </View>

              <Svg height="100%" width={50}>
                <Line x1="0" y1="135" x2="25" y2="135" stroke="white" strokeWidth="2" />
                <Line x1="25" y1="135" x2="25" y2="265" stroke="white" strokeWidth="2" />

                <Line x1="25" y1="265" x2= "50" y2="265" stroke="white" strokeWidth="2" />

                <Line x1="0" y1="390" x2="25" y2="390" stroke="white" strokeWidth="2" />
                <Line x1="25" y1="390" x2="25" y2="265" stroke="white" strokeWidth="2" />
              </Svg>

              <View style={styles.column}>
                {games.semiEsq.map((game, idx) => (
                  <MatchCard key={`semiEsq-${idx}`} {...game} />
                ))}
              </View>

              <Svg height="100%" width={50}>
                <Line x1="0" y1="265" x2="100%" y2="265" stroke="white" strokeWidth="2" />
              </Svg>

              <View style={styles.finalColumn}>
                {games.final.map((game, idx) => (
                  <MatchCard key={`final-${idx}`} {...game} />
                ))}
                {games.terceiroLugar.map((game, idx) => (
                  <MatchCard key={`terceiroLugar-${idx}`} {...game} />
                ))}
              </View>

              <Svg height="100%" width={50}>
                <Line x1="0" y1="265" x2="50" y2="265" stroke="white" strokeWidth="2" />
              </Svg>

              <View style={styles.column}>
                {games.semiDir.map((game, idx) => (
                  <MatchCard key={`semiDir-${idx}`} {...game} />
                ))}
              </View>

              <Svg height="100%" width={50}>
                <Line x1="25" y1="135" x2="50" y2="135" stroke="white" strokeWidth="2" />
                <Line x1="25" y1="135" x2="25" y2="265" stroke="white" strokeWidth="2" />

                <Line x1="0" y1="265" x2= "25" y2="265" stroke="white" strokeWidth="2" />

                <Line x1="25" y1="390" x2="50" y2="390" stroke="white" strokeWidth="2" />
                <Line x1="25" y1="390" x2="25" y2="265" stroke="white" strokeWidth="2" />
              </Svg>

              <View style={styles.columnQuartas}>
                {games.quartasDir.map((game, idx) => (
                  <MatchCard key={`quartasDir-${idx}`} {...game} />
                ))}
              </View>

              <Svg height="100%" width={50}>
                <Line x1="25" y1="65" x2="50" y2="65" stroke="black" strokeWidth="1.5" />
                <Line x1="25" y1="65" x2="25" y2="135" stroke="black" strokeWidth="1.5" />

                <Line x1="0" y1="135" x2="25" y2="135" stroke="black" strokeWidth="1.5" />

                <Line x1="25" y1="195" x2="50" y2="195" stroke="black" strokeWidth="1.5" />
                <Line x1="25" y1="195" x2="25" y2="135" stroke="black" strokeWidth="1.5" />

                <Line x1="25" y1="325" x2="50" y2="325" stroke="black" strokeWidth="1.5" />
                <Line x1="25" y1="325" x2="25" y2="390" stroke="black" strokeWidth="1.5" />

                <Line x1="0" y1="390" x2="25" y2="390" stroke="black" strokeWidth="1.5" />
                
                <Line x1="25" y1="455" x2="50" y2="455" stroke="black" strokeWidth="1.5" />
                <Line x1="25" y1="455" x2="25" y2="390" stroke="black" strokeWidth="1.5" />
              </Svg>

              <View style={styles.column}>
                {games.oitavasDir.map((game, idx) => (
                  <MatchCard key={`oitavasDir-${idx}`} {...game} />
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f5f5f5',
  },
  grupoContainer: {
    marginBottom: 24,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    borderRadius: 5,
  },
  headerCell: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
  },
  jogosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  jogoCard: {
    width: '32%',
    backgroundColor: '#e3e3e3',
    padding: 8,
    marginBottom: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  jogoTimes: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  jogoPlacar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  input: {
    width: 32,
    height: 30,
    paddingTop: 0,
    paddingBottom: 0,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    textAlign: 'center',
    backgroundColor: '#fff',
    fontSize: 12,
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 12,
  },
  toggleButton: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 5,
    marginHorizontal: 4,
    fontWeight: 'bold',
    color: '#333',
  },
  activeButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
  bracketContainer: {
    paddingVertical: 0,
    alignItems: 'center',
  },
  column: {
    alignItems: 'center',
    marginHorizontal: 0,
  },
  columnQuartas: {
    gap: 130,
    alignItems: 'center',
    marginHorizontal: 0,
  },
  finalColumn: {
    paddingTop: 130,
    alignItems: 'center',
    marginHorizontal: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontSize: 10,
    marginBottom: 5,
    color: '#333',
  },
  team: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#222',
  },
  title: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
  },

});

export default TabelaScreen;
