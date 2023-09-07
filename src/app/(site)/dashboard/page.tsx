import { getAuthSession } from "@/lib/auth";

const Dashboard = async () => {
  const session = await getAuthSession();

  return (
    <div>
      <p>Dashboard page</p>
      <pre>{JSON.stringify(session)}</pre>
    </div>
  );
};

export default Dashboard;
