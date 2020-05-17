import React, { useEffect, useState, useMemo, useRef } from 'react';
import styled, { css } from 'styled-components';

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
  const [autoRun, setAutoRun] = useState(false);

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
      if (a[1] === b[1]) {
        return a[0] > b[0] ? 1 : -1;
      }
      return a[1] > b[1] ? -1 : 1;
    }).map(i => i[0]);
    return thisSortedVillagerNames
  }, [visibleDataset]);

  const changeViewIndex = (newViewIndex: number, autoplay?: boolean) => {
    if (autoRun && autoplay) {
      setAutoRun(false);
      return;
    }
    if (newViewIndex > viewIndex && autoplay) {
      setAutoRun(true);
    } else {
      setAutoRun(false);
    }
    setViewIndex(newViewIndex);
  };

  const highestCount = visibleDataset?.data[sortedVillagerNames?.[0]] || 1;
  const highestScale = 50 + (50 * (viewIndex + 1) / dataSets.length);
  const autoMoveTimeout = useRef(0);
  return (
    <MainContainer>
      <ControlPanel>
        {isLoading && <div style={{
          position: 'absolute',
          bottom: '100%',
          right: 0,
          whiteSpace: 'nowrap',
        }}>loading... {dataSets.length} data files</div>}
        {viewIndex > 1 && <button onClick={() => { changeViewIndex(0); }}>first</button>}
        <button onClick={() => { changeViewIndex(Math.max(0, viewIndex - 1)); }}>prev</button>
        <button onClick={() => { changeViewIndex(Math.min(dataSets.length - 1, viewIndex + 1)); }}>next</button>
        {viewIndex < dataSets.length - 2 && <button onClick={() => { changeViewIndex(dataSets.length - 1); }}>last</button>}
        <button onClick={() => { changeViewIndex(Math.min(dataSets.length - 1, viewIndex + 1), true); }}>{autoRun ? 'stop' : 'play'}</button>
        <div style={{ textAlign: 'center' }}>{visibleDataset && visibleDataset.date.toDateString()}</div>
      </ControlPanel>
      {!isLoading && <ChartContainer style={{
        height: chartRowHeight * (sortedVillagerNames.length + 1),
      }}>
        {visibleDataset && Object.entries(visibleDataset.data).map(([key, value], itemIndex) => {
          const vData = villagersData[key as VillagerName];
          if (!vData) {
            return null;
          }
          const sortIndex = sortedVillagerNames.indexOf(key);
          const shiftPercent = value / highestCount * highestScale;
          return <ChartRow
            key={key}
            style={{
              transform: `
                translateY(${chartRowHeight + sortIndex * chartRowHeight}px)
                translateX(${shiftPercent}%)
                translateX(${chartRowHeight / 2}px)
              `,
            }}
            farRight={shiftPercent > 80}
            onTransitionEnd={itemIndex === 0 ? () => {
              if (autoRun && viewIndex < dataSets.length - 1) {
                clearTimeout(autoMoveTimeout.current);
                autoMoveTimeout.current = setTimeout(() => {
                  setViewIndex(viewIndex + 1);
                }, 50);
              }
            } : undefined}
          >
            <BarLine
              style={{
                background: `rgb(
                  ${value/highestCount*255},
                  ${255 - value/highestCount*255},
                  0
                )`,
              }}
            />
            <VillagerBar>
              <div>
                {sortIndex + 1}.
              </div>
              <div>
                <div>
                  {sortIndex === 0 && vData.name === 'Raymond' && 'Fucking '}
                  {vData.name}
                </div>
                <div>
                  {value}
                </div>
              </div>
            </VillagerBar>
            <VillagerIcon
              style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}/img/villagers/${vData?.id}.png)`,
              }}
            />
          </ChartRow>;
        })}
      </ChartContainer>}
    </MainContainer>
  );
}

const MainContainer = styled.div`
  font-family: sans-serif;
  font-size: 12px;
  width: 90vw;
  overflow: hidden;
`;

const ControlPanel = styled.div`
  position: fixed;
  right: 10px;
  bottom: 10px;
  z-index: 1;
  background: rgba(255, 255, 255, 0.8);
  padding: 10px;
`;

const ChartContainer = styled.div`
  position: relative;
  margin: 20px;
  overflow: hidden;
`;

const transitionDur = 1;
const VillagerBar = styled.div`
  font-size: 10px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%) translateX(${chartRowHeight / 2}px);
  display: flex;
  left: 0;
  transition: transform ${transitionDur}s;

  > div {
    padding-right: 4px;
  }
`;

interface VillagerIconProps {
  back?: boolean;
}
const VillagerIcon = styled.div<VillagerIconProps>`
  display: inline-block;
  vertical-align: middle;
  width: ${chartRowHeight}px;
  height: ${chartRowHeight}px;
  position: absolute;
  top: 0;
  left: 0;
  background-repeat: no-repeat;
  background-position: center left;
  background-size: contain;
  transform: translateX(-50%);

  ${({ back }) => back && css`
    width: ${chartRowHeight + 10}px;
    height: ${chartRowHeight + 10}px;
    transform: translateX(-50%) translateY(-5px);
    filter: invert(1);
  `}
`;

interface ChartRowProps {
  farRight: boolean;
}
const ChartRow = styled.div<ChartRowProps>`
  height: ${chartRowHeight}px;
  position: absolute;
  top: 0;
  left: 0;
  width: 95%;
  transition: transform ${transitionDur}s;

  span {
    vertical-align: middle;
  }

  ${({ farRight }) => farRight && css`
    ${VillagerBar} {
      transform: translateY(-100%) translateX(-100%) translateX(${-chartRowHeight / 2}px);
    }
  `}
`;

const BarLine = styled.div`
  height: 5px;
  width: 100%;
  background: #c00;
  position: absolute;
  top: 50%;
  right: 100%;
  transition: background ${transitionDur}s;
  opacity: 0.5;
`;

export default App;
