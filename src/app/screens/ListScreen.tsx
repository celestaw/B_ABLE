import { useState } from 'react';
import { SortKey, TIER_COLOR, TIER_LABEL, World, toDateKey } from '../../core';
import { MinoView } from '../components/MinoView';

export function ListScreen({ world }: { world: World }) {
  const [text, setText] = useState('');
  const [sort, setSort] = useState<SortKey>('due');
  const [includeDone, setIncludeDone] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const now = new Date();
  const tasks = world.tasks.query({ text, includeDone, sort });

  return (
    <div className="screen list-screen">
      <div className="board-frame">
        <div className="board-inner">
          <div className="board-controls">
            <input
              className="search"
              placeholder="タスクを検索"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="chip"
              onClick={() => setIncludeDone((v) => !v)}
              aria-pressed={includeDone}
            >
              {includeDone ? '全て' : '未完'}
            </button>
            <select
              className="chip"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="ソート順"
            >
              <option value="due">期限順</option>
              <option value="importance">重要度順</option>
              <option value="created">追加順</option>
            </select>
          </div>

          <ul className="task-list">
            {tasks.length === 0 && (
              <li className="empty">
                依頼書はまだありません。右下の + からタスクを貼り出してください。
              </li>
            )}
            {tasks.map((t) => {
              const tier = t.tier(now);
              const left = t.daysLeft(now);
              return (
                <li key={t.id} className={'task-row' + (t.done ? ' done' : '')}>
                  <div className="stars" aria-label={`重要度${t.importance}`}>
                    {'★'.repeat(t.importance)}
                    <span className="dim">{'☆'.repeat(5 - t.importance)}</span>
                  </div>
                  <div className="task-main">
                    <div className="task-title">{t.title}</div>
                    <div className="task-meta">
                      <span>{t.due ? `~ ${t.due}` : '期限なし'}</span>
                      <span className={'left l' + tier}>
                        {!isFinite(left)
                          ? ''
                          : left < 0
                            ? `${-left}日超過`
                            : left === 0
                              ? '本日'
                              : `残${left}日`}
                        ・{TIER_LABEL[tier]}
                      </span>
                    </div>
                  </div>
                  <div className="task-mino">
                    <MinoView poly={t.polyomino(now)} color={TIER_COLOR[tier]} unit={9} />
                  </div>
                  {t.done ? (
                    <button className="row-btn" onClick={() => world.removeTask(t.id)}>
                      消す
                    </button>
                  ) : (
                    <button
                      className="row-btn go"
                      onClick={() => world.completeTask(t.id)}
                    >
                      完了
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <button
          className="fab"
          onClick={() => setFormOpen(true)}
          aria-label="タスクを追加"
        >
          ＋
        </button>
      </div>

      {formOpen && (
        <RequestForm
          onClose={() => setFormOpen(false)}
          onSubmit={(input) => {
            world.addTask(input);
            setFormOpen(false);
          }}
        />
      )}
    </div>
  );
}

function RequestForm({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (t: {
    title: string;
    detail: string;
    due: string;
    importance: number;
  }) => void;
}) {
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [due, setDue] = useState(toDateKey(new Date()));
  const [importance, setImportance] = useState(3);

  return (
    <div className="modal-back" onClick={onClose}>
      <form
        className="paper"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          onSubmit({ title: title.trim(), detail, due, importance });
        }}
      >
        <h2 className="paper-title">依頼書</h2>
        <label className="field">
          <span>題目</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
        </label>
        <label className="field">
          <span>内容</span>
          <textarea
            rows={4}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
        </label>
        <label className="field">
          <span>期限</span>
          <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        </label>
        <label className="field">
          <span>重要度</span>
          <select
            value={importance}
            onChange={(e) => setImportance(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {'★'.repeat(n)}
              </option>
            ))}
          </select>
        </label>
        <div className="paper-note">
          期限が近いほど、完了時に手に入るミノのマス数が増えます。積みにくくなるので早く終わらせてください。
        </div>
        <div className="paper-actions">
          <button type="button" className="ghost" onClick={onClose}>
            やめる
          </button>
          <button type="submit" className="primary">
            貼り出す
          </button>
        </div>
      </form>
    </div>
  );
}
