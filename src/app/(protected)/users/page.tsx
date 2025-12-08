"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import UserCard from "@/components/UserCard";

const QUERY_USERS = gql`
  query {
    users {
      id
      name
      email
      role
    }
  }
`;

export default function UsersPage() {
  const { data, loading, error } = useQuery(QUERY_USERS);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error.message}</p>;

  return (
    <main style={{ padding: 20 }}>
      <h1>Usuários</h1>
      {data.users.map((user: any) => (
        <UserCard key={user.id} user={user} />
      ))}
    </main>
  );
}
