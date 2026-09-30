import { CloudIcon, BookIcon, CalendarIcon, DocIcon, SparkleIcon, StarIcon } from './Icons.jsx';

const map = {
  sky: StarIcon,
  cloud: CloudIcon,
  book: BookIcon,
  calendar: CalendarIcon,
  doc: DocIcon,
  sparkle: SparkleIcon
};

export default function ServiceIcon({ icon, ...props }) {
  const Cmp = map[icon] || SparkleIcon;
  return <Cmp {...props} />;
}
