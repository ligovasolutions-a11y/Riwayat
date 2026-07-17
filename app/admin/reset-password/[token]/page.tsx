import ResetPasswordForm from './ResetPasswordForm';

type Params = { params: Promise<{ token: string }> };

export default async function ResetPasswordPage({ params }: Params) {
  const { token } = await params;
  return (
    <div className="a-auth-wrap">
      <div className="a-auth-card">
        <div className="a-auth-logo">Riwayat <span>Jewels</span></div>
        <div className="a-auth-sub">Set A New Password</div>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
