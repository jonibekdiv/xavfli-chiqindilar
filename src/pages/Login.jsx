import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Input, Button } from '../components/UI.jsx';
import { ShieldCheck } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ login: 'korxona', password: '123456' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const res = login(form.login.trim(), form.password);
      setLoading(false);
      if (!res.ok) setError(res.error);
      else nav('/', { replace: true });
    }, 350);
  };

  const quick = (l) => setForm({ login: l, password: '123456' });

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-logo">
  <ShieldCheck size={36} strokeWidth={2.2} />
</div>
        <h1 className="auth-title">Xavfli chiqindilarni boshqarish</h1>
        <p className="auth-sub">Yagona axborot platformasi</p>

        <Input
          label="STIR / Login"
          placeholder="Loginni kiriting"
          value={form.login}
          onChange={e => setForm({ ...form, login: e.target.value })}
        />
        <Input
          label="Parol"
          type="password"
          placeholder="••••••"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        {error && (
          <div style={{ color: '#FF3B30', fontSize: 13, marginBottom: 12, paddingLeft: 4 }}>⚠ {error}</div>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? 'Kirish...' : 'Tizimga kirish'}
        </Button>

        <div className="auth-hint">
          <b>Demo kirishlar (parol: 123456)</b><br />
          <div className="row mt-2" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => quick('korxona')}>Korxona</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => quick('mintaqa')}>Mintaqa</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => quick('direksiya')}>Direksiya</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => quick('admin')}>Admin</button>
          </div>
        </div>
      </form>
    </div>
  );
}