export type AdminUser = {
  id: string;
  email: string;
  role: string;
  subscriptionStatus: string;
  uploadedDocuments: number;
};

export function AdminUserTable({ users }: { users: AdminUser[] }) {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Clientes</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Função</th>
            <th>Assinatura</th>
            <th>Docs</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.subscriptionStatus}</td>
              <td>{user.uploadedDocuments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
