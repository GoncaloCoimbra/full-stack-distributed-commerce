import React from 'react';

type Member = { id: string; name: string; online?: boolean };
type FileItem = { id: string; name: string; url: string; size?: number };

const AVATAR_COLORS = [
  'hsl(345, 80%, 50%)',
  'hsl(356, 76%, 42%)',
  'hsl(15, 72%, 45%)',
  'hsl(12, 64%, 38%)',
  'hsl(2, 74%, 44%)',
  'hsl(1, 78%, 46%)',
];
const getAvatarColor = (uid: string) => AVATAR_COLORS[uid.charCodeAt(0) % AVATAR_COLORS.length];

type Props = {
  members: Member[];
  files: FileItem[];
};

export default function SidebarRight({ members, files }: Props) {
  return (
    <aside className="app-rightbar">
      <div className="right-section">
        <div className="avatar-stack">
          {members.slice(0, 5).map((member, idx) => (
            <span key={member.id} className="avatar-circle small stack-item" style={{ background: getAvatarColor(member.id), zIndex: 10 - idx }}>
              {member.name.split(' ').map(n => n[0]).slice(0,2).join('')}
            </span>
          ))}
          {members.length > 5 && (
            <span className="avatar-circle small stack-item stack-more">+{members.length - 5}</span>
          )}
        </div>
        <h4>Online</h4>
        <div className="member-list">
          {members.length === 0 ? <div className="muted">Nenhum membro online</div> : null}
          {members.map((m) => (
            <div key={m.id} className="member-row">
              <span className="avatar-circle small">{m.name.split(' ').map(n => n[0]).slice(0,2).join('')}</span>
              <div className="member-meta">
                <div className="member-name">{m.name}</div>
                <div className="member-status">{m.online ? 'Online' : 'Offline'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="right-section">
        <h4>Ficheiros do canal</h4>
        <div className="file-list">
          {files.length === 0 ? <div className="muted">Sem ficheiros</div> : null}
          {files.map((f) => (
            <a key={f.id} className="file-item" href={f.url} target="_blank" rel="noreferrer">
              <div className="file-name">{f.name}</div>
              <div className="file-meta">{f.size ? `${(f.size/1024).toFixed(1)} KB` : ''}</div>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
