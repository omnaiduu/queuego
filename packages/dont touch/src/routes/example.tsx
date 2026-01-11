// Example: Using TanStack Query with oRPC
import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orpc } from '../lib/orpc-client'

export const Route = createFileRoute('/example')({
  component: ExamplePage,
})

function ExamplePage() {
  const queryClient = useQueryClient()

  // Fetch users with suspense (runs on server during SSR)
  const { data: users } = useSuspenseQuery(
    orpc.users.list.queryOptions({ input: { limit: 5 } })
  )

  // Mutation to create a new user
  const createUser = useMutation(
    orpc.users.create.mutationOptions({
      onSuccess: () => {
        // Invalidate and refetch users list
        queryClient.invalidateQueries({
          queryKey: orpc.users.list.key(),
        })
      },
    })
  )

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>🎉 Full-Stack Integration Complete!</h1>

      <div style={{ marginTop: '2rem' }}>
        <h2>✅ Working Features:</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li>✅ Backend oRPC server (port 4000)</li>
          <li>✅ Frontend TanStack Start (port 3000)</li>
          <li>✅ Type-safe RPC calls</li>
          <li>✅ SSR with data prefetching</li>
          <li>✅ Mutations with cache invalidation</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>👥 Users from Backend:</h2>
        {users.length === 0 ? (
          <p style={{ color: '#666' }}>No users yet. Create one below!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {users.map((user) => (
              <li
                key={user.id}
                style={{
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  background: '#f5f5f5',
                  borderRadius: '8px'
                }}
              >
                <strong>{user.name}</strong> - {user.email}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>➕ Create User:</h2>
        <button
          onClick={() => {
            createUser.mutate({
              name: `User ${Date.now()}`,
              email: `user${Date.now()}@example.com`,
              password: 'password123',
            })
          }}
          disabled={createUser.isPending}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            background: createUser.isPending ? '#ccc' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: createUser.isPending ? 'not-allowed' : 'pointer',
          }}
        >
          {createUser.isPending ? 'Creating...' : 'Create Random User'}
        </button>

        {createUser.isError && (
          <p style={{ color: 'red', marginTop: '1rem' }}>
            Error: {createUser.error.message}
          </p>
        )}

        {createUser.isSuccess && (
          <p style={{ color: 'green', marginTop: '1rem' }}>
            ✅ User created successfully!
          </p>
        )}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
        <h3>🎯 Type Safety in Action:</h3>
        <p>Try typing <code>orpc.users.</code> in your IDE - you will get full autocomplete!</p>
        <ul>
          <li><code>orpc.users.list</code> - List all users</li>
          <li><code>orpc.users.find</code> - Find user by ID</li>
          <li><code>orpc.users.create</code> - Create new user</li>
        </ul>
      </div>
    </div>
  )
}
