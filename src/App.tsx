import { useState } from 'react';
import { useWorld } from './app/hooks/useWorld';
import { CalendarScreen } from './app/screens/CalendarScreen';
import { ListScreen } from './app/screens/ListScreen';
import { BabelScreen } from './app/screens/BabelScreen';

type Tab = 'calendar' | 'list' | 'babel';

const TABS: readonly (readonly [Tab, string])[] = [
  ['calendar', 'カレンダー'],
  ['list', 'リスト'],
  ['babel', 'babel'],
];

export default function App() {
  const world = useWorld();
  const [tab, setTab] = useState<Tab>('list');

  // 3画面とも常時マウントしたままにする。落下中に画面を移動しても
  // シミュレーションは World 側で走り続け、戻れば同じ位置から続きになる。
  return (
    <div className="app">
      <header className="app-bar">
        <span className="logo">B ABLE</span>
        <span className="sub">タスクを積んで塔を建てる</span>
      </header>

      <main className="stage">
        <div hidden={tab !== 'calendar'} className="pane">
          <CalendarScreen world={world} />
        </div>
        <div hidden={tab !== 'list'} className="pane">
          <ListScreen world={world} />
        </div>
        <div hidden={tab !== 'babel'} className="pane">
          <BabelScreen world={world} />
        </div>
      </main>

      <nav className="tabbar">
        {TABS.map(([k, label]) => (
          <button
            key={k}
            className={'tab' + (tab === k ? ' on' : '')}
            onClick={() => setTab(k)}
          >
            {label}
            {k === 'babel' && world.inventory.length > 0 && (
              <span className="badge">{world.inventory.length}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
