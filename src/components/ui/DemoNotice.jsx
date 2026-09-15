import { Link } from 'react-router-dom';
import demo from '../../data/demo.json';
export default function DemoNotice() {
  return <aside className="demo-notice" aria-label="Demonstration notice">
    <strong>{demo.banner}</strong><p>{demo.intakeNotice}</p>
    <nav aria-label="Demonstration links"><Link to="/experience">Explore sample patient journey</Link><Link to="/trust">Privacy & engineering</Link></nav>
  </aside>;
}
