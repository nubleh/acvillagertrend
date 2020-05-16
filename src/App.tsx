import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';

import villagersData from './data/villagers.json';
type VillagerName = keyof typeof villagersData;

interface Data {
  [key: string]: number;
}
interface DataSet {
  date: Date;
  data: Data;
}

const chartRowHeight = 30;

const firstDate = new Date('2020/03/21');
function App() {
  const [dataSets, setDataSets] = useState([] as DataSet[]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewIndex, setViewIndex] = useState(0);

  useEffect(() => {
    const getForDate = (date: Date) => {
      const fileName = `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}`;
      const filePath = `${process.env.PUBLIC_URL}/data/${fileName}.json`;
      fetch(filePath).then(r => r.json()).then(j => {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        getForDate(nextDate);

        setDataSets((prev) => {
          return [
            ...prev,
            {
              date,
              data: j as Data,
            },
          ];
        });
      }).catch(e => {
        setIsLoading(false);
      });
    };
    getForDate(firstDate);
  }, []);

  const visibleDataset = useMemo(() => {
    return dataSets[viewIndex];
  }, [viewIndex, dataSets]);
  const sortedVillagerNames = useMemo(() => {
    if (!visibleDataset) {
      return [];
    }
    const thisSortedVillagerNames = Object.entries(visibleDataset.data).sort((a, b) => {
      return a[1] > b[1] ? -1 : 1;
    }).map(i => i[0]);
    return thisSortedVillagerNames
  }, [visibleDataset]);

  const highestCount = visibleDataset?.data[sortedVillagerNames?.[0]] || 1;
  const highestScale = 50 + (50 * (viewIndex + 1) / dataSets.length);
  return (
    <MainContainer>
      <div style={{
        background: 'white',
        position: 'fixed',
        top: 0,
        zIndex: 1,
      }}>
        {isLoading && <>loading...</>}
        {viewIndex + 1}/{dataSets.length} items
        <button onClick={() => { setViewIndex(Math.max(0, viewIndex - 1)); }}>prev</button>
        <button onClick={() => { setViewIndex(Math.min(dataSets.length - 1, viewIndex + 1)); }}>next</button>
        <div style={{ textAlign: 'center' }}>{visibleDataset && visibleDataset.date.toDateString()}</div>
      </div>
      <ChartContainer style={{
        height: chartRowHeight * sortedVillagerNames.length,
      }}>
        {visibleDataset && Object.entries(visibleDataset.data).map(([key, value]) => {
          const vData = villagersData[key as VillagerName];
          if (!vData) {
            return null;
          }
          const sortIndex = sortedVillagerNames.indexOf(key);
          return <ChartRow
            key={key}
            style={{
              transform: `
                translateY(${sortIndex * chartRowHeight}px)
                translateX(${value / highestCount * highestScale}%)
              `,
            }}
          >
            <VillagerBar>
              {vData.name}
              <div>
                {value}
              </div>
            </VillagerBar>
            <VillagerIcon
              style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}/img/villagers/${vData?.id}.png)`,
              }}
            />
          </ChartRow>;
        })}
      </ChartContainer>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  font-family: sans-serif;
  font-size: 12px;
`;

const ChartContainer = styled.div`
  position: relative;
  margin: 20px;
`;

const transitionDur = 1;
const ChartRow = styled.div`
  height: ${chartRowHeight}px;
  position: absolute;
  top: 0;
  left: 0;
  width: 95%;
  transition: transform ${transitionDur}s;

  span {
    vertical-align: middle;
  }
`;

const VillagerBar = styled.div`
  font-size: 10px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;

const VillagerIcon = styled.div`
  display: inline-block;
  vertical-align: middle;
  width: ${chartRowHeight}px;
  height: ${chartRowHeight}px;
  position: absolute;
  top: 0;
  right: 100%;
  background-repeat: no-repeat;
  background-position: center left;
  background-size: contain;
`;

export default App;
