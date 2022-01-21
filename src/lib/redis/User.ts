import { Entity, Schema, Repository } from 'redis-om';
import { connect, client } from './index';

class CachedUser extends Entity {}
const userSchema = new Schema(
  CachedUser,
  {
    name: { type: 'string' },
    email: { type: 'string' },
    role: { type: 'string' },
  },
  {
    dataStructure: 'JSON',
  }
);

export async function createCachedUser(
  user: Record<string, number | boolean | string | string[] | null>
): Promise<string> {
  await connect();

  const userRepository = new Repository(userSchema, client);

  const cachedUser = userRepository.createEntity(user);

  const id = await userRepository.save(cachedUser);

  return id;
}
