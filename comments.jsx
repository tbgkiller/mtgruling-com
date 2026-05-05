// comments.jsx — comment thread with voting + replies + composer.

function CommentThread({ seed }) {
  const [comments, setComments] = React.useState(() => seed.map((c) => ({
    ...c, userVote: 0, score: c.score,
    replies: (c.replies || []).map((r) => ({ ...r, userVote: 0, score: r.score })),
  })));
  const [sort, setSort] = React.useState('best');
  const [composer, setComposer] = React.useState('');
  const [replyOpen, setReplyOpen] = React.useState(null);

  const vote = (cid, rid, dir) => {
    setComments((cs) => cs.map((c) => {
      if (rid == null) {
        if (c.id !== cid) return c;
        const next = dir === c.userVote ? 0 : dir;
        return { ...c, userVote: next, score: c.score - c.userVote + next };
      }
      if (c.id !== cid) return c;
      return {
        ...c,
        replies: c.replies.map((r) => {
          if (r.id !== rid) return r;
          const next = dir === r.userVote ? 0 : dir;
          return { ...r, userVote: next, score: r.score - r.userVote + next };
        }),
      };
    }));
  };

  const submit = () => {
    if (!composer.trim()) return;
    setComments((cs) => [
      { id: 'cn-' + Date.now(), user: 'you', score: 1, userVote: 1, age: 'just now',
        body: composer.trim(), replies: [] },
      ...cs,
    ]);
    setComposer('');
  };

  const submitReply = (cid, text) => {
    if (!text.trim()) return;
    setComments((cs) => cs.map((c) => c.id !== cid ? c : {
      ...c,
      replies: [...c.replies, {
        id: 'rn-' + Date.now(), user: 'you', score: 1, userVote: 1, age: 'just now',
        body: text.trim(),
      }],
    }));
    setReplyOpen(null);
  };

  const sorted = React.useMemo(() => {
    const arr = [...comments];
    if (sort === 'top') arr.sort((a, b) => b.score - a.score);
    else if (sort === 'new') arr.sort((a, b) => (a.age === 'just now' ? -1 : 1));
    else arr.sort((a, b) => (b.score + b.replies.length * 5) - (a.score + a.replies.length * 5));
    return arr;
  }, [comments, sort]);

  return (
    <section className="comments-section" id="comments">
      <div className="comments-h">
        <h2>Comments <span style={{ color: 'var(--ink-3)', fontSize: 16, fontWeight: 400 }}>· {comments.length + comments.reduce((a, c) => a + c.replies.length, 0)}</span></h2>
        <div className="sort">
          {['best', 'top', 'new'].map((s) => (
            <button key={s} className={sort === s ? 'active' : ''} onClick={() => setSort(s)}>{s}</button>
          ))}
        </div>
      </div>

      <div className="comment-composer">
        <div className="avatar" aria-hidden>U</div>
        <textarea
          placeholder="Write a comment… (or tap 1+ mana to pin it)"
          value={composer}
          onChange={(e) => setComposer(e.target.value)}
        />
        <div className="composer-actions">
          <button className="btn primary tiny" disabled={!composer.trim()} onClick={submit}>Post</button>
          <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>Markdown ok</span>
        </div>
      </div>

      {sorted.map((c) => (
        <Comment
          key={c.id}
          c={c}
          onVote={(dir) => vote(c.id, null, dir)}
          onVoteReply={(rid, dir) => vote(c.id, rid, dir)}
          replyOpen={replyOpen === c.id}
          onToggleReply={() => setReplyOpen(replyOpen === c.id ? null : c.id)}
          onSubmitReply={(t) => submitReply(c.id, t)}
        />
      ))}
    </section>
  );
}

function Comment({ c, onVote, onVoteReply, replyOpen, onToggleReply, onSubmitReply }) {
  const [reply, setReply] = React.useState('');
  return (
    <div className="comment">
      <div className="comment-rail">
        <button className={`vote-up ${c.userVote === 1 ? 'active' : ''}`} onClick={() => onVote(1)} aria-label="Upvote"><window.I.Up /></button>
        <span className={`score ${c.score < 0 ? 'neg' : c.score > 100 ? 'pos' : ''}`}>{c.score > 999 ? (c.score / 1000).toFixed(1) + 'k' : c.score}</span>
        <button className={`vote-down ${c.userVote === -1 ? 'active' : ''}`} onClick={() => onVote(-1)} aria-label="Downvote"><window.I.Down /></button>
      </div>
      <div className="comment-body">
        <div className="comment-meta">
          <span className="user">{c.user}</span>
          {c.flair && <span className={`flair ${flairClass(c.flair)}`}>{c.flair}</span>}
          <span>· {c.age}</span>
        </div>
        <div className="comment-text">{c.body}</div>
        <div className="comment-actions">
          <button onClick={onToggleReply}>{replyOpen ? 'Cancel' : 'Reply'}</button>
          <button>Share</button>
          <button>Report</button>
          <button>Tap mana to boost</button>
        </div>

        {replyOpen && (
          <div className="comment-composer" style={{ marginTop: 12, marginBottom: 0 }}>
            <div className="avatar" aria-hidden>U</div>
            <textarea autoFocus value={reply} onChange={(e) => setReply(e.target.value)} placeholder={`Reply to ${c.user}…`} />
            <div className="composer-actions">
              <button className="btn primary tiny" disabled={!reply.trim()} onClick={() => { onSubmitReply(reply); setReply(''); }}>Reply</button>
            </div>
          </div>
        )}

        {c.replies.length > 0 && (
          <div className="comment-replies">
            {c.replies.map((r) => (
              <div className="comment" key={r.id}>
                <div className="comment-rail">
                  <button className={`vote-up ${r.userVote === 1 ? 'active' : ''}`} onClick={() => onVoteReply(r.id, 1)} aria-label="Upvote"><window.I.Up /></button>
                  <span className={`score ${r.score < 0 ? 'neg' : r.score > 100 ? 'pos' : ''}`}>{r.score}</span>
                  <button className={`vote-down ${r.userVote === -1 ? 'active' : ''}`} onClick={() => onVoteReply(r.id, -1)} aria-label="Downvote"><window.I.Down /></button>
                </div>
                <div className="comment-body">
                  <div className="comment-meta">
                    <span className="user">{r.user}</span>
                    {r.flair && <span className={`flair ${flairClass(r.flair)}`}>{r.flair}</span>}
                    <span>· {r.age}</span>
                  </div>
                  <div className="comment-text">{r.body}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function flairClass(flair) {
  const f = (flair || '').toLowerCase();
  if (f.includes('judge')) return 'judge';
  if (f.includes('author')) return 'author';
  if (f.includes('mod')) return 'mod';
  if (f.includes('sponsor')) return 'sponsor';
  return '';
}

window.CommentThread = CommentThread;
