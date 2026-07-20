import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';

export default function HelpPage() {
  redirect(ROUTES.PUBLIC.FAQ);
}
