import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import trust from '../data/trust.json';
import { runtime } from '../config/runtime';
export default function TrustPage() {
  const [message,setMessage] = useState('');
  return <article className="review-page">
    <Helmet><title>{trust.title} — Everyday Dental</title></Helmet>
    <h1>{trust.title}</h1><p>{trust.intro}</p>
    <p><Link to="/experience">Explore the sample patient journey</Link></p>
    {trust.sections.map(section => <section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}
    <button onClick={() => { try { localStorage.removeItem(runtime.languageStorageKey); setMessage('Saved language preference cleared.'); } catch { setMessage('Browser storage is unavailable; no preference was changed.'); } }}>Clear saved language preference</button>
    <p role="status">{message}</p>
    <h2>Primary references</h2><ul>{trust.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul>
  </article>;
}
