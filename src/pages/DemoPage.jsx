import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import demo from '../data/demo.json';
import { canAccess, initialDemo, sampleBundle, transition } from '../lib/demo-policy';
import { runtime } from '../config/runtime';

export default function DemoPage() {
  const [role, setRole] = useState('patient');
  const [state, setState] = useState(initialDemo);
  const [message, setMessage] = useState('Choose an action to explore the example.');
  const [events, setEvents] = useState([]);
  function act(action) {
    const result = transition(state, role, action);
    setState(result.state); setMessage(result.message);
    setEvents(items => [{ role, action, outcome: result.outcome }, ...items].slice(0, runtime.maxAuditEvents));
    if (action === 'export' && result.outcome === 'allowed') {
      const url = URL.createObjectURL(new Blob([JSON.stringify(sampleBundle(), null, 2)], { type: 'application/fhir+json' }));
      const link = document.createElement('a'); link.href = url; link.download = 'synthetic-patient.fhir.json'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 0);
    }
  }
  return <section className="review-page">
    <Helmet><title>Patient journey demo — Everyday Dental</title></Helmet>
    <h1>{demo.title}</h1><p>{demo.intro}</p>
    <p><strong>Role selection is a simulation, not a login.</strong> The production design requires verified identity and server-enforced authorization.</p>
    <label htmlFor="demo-role">View as </label>
    <select id="demo-role" value={role} onChange={e => setRole(e.target.value)}>{demo.roles.map(r => <option key={r}>{r}</option>)}</select>
    <div className="review-grid">
      <article><h2>Sample record</h2>{state.erased ? <p>Record erased in this tab.</p> : <>
        <p>{demo.patient.name}</p><p>{demo.appointment.service}</p><p>Appointment: <strong>{state.status}</strong></p>
        <p>Optional sharing: <strong>{state.consent ? 'Granted' : 'Not granted'}</strong></p>
        <p>Legal hold: <strong>{state.legalHold ? 'Active' : 'Released'}</strong></p>
        <p>{canAccess(role, 'clinical', demo.patient.id) ? demo.clinicalNote : 'Clinical details are hidden from reception.'}</p>
      </>}</article>
      <article><h2>Try a workflow</h2><div className="review-actions">{Object.entries(demo.actions).map(([action,label]) => <button key={action} onClick={() => act(action)}>{label}</button>)}</div></article>
    </div>
    <p role="status" aria-live="polite" className="review-notice">{message}</p>
    <h2>Cross-patient access example</h2>
    <p>Current role accessing another synthetic patient’s clinical record: <strong>{canAccess(role, 'clinical', demo.otherPatientId) ? 'Allowed in this simplified policy' : 'Denied'}</strong>.</p>
    <p>Real staff access additionally needs assigned-care scope, purpose checks, tenant isolation and monitored emergency access.</p>
    <h2>Session activity</h2><p>This temporary list demonstrates outcomes. It is not an immutable server audit log.</p>
    <ol>{events.map((e,i) => <li key={i}>{e.role} · {e.action} · {e.outcome}</li>)}</ol>
    <button onClick={() => { setState(initialDemo()); setEvents([]); setRole('patient'); setMessage('Example reset.'); }}>Reset demonstration</button>
    <p><Link to="/trust">Read privacy, security and scaling information</Link></p>
  </section>;
}
