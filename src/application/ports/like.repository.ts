export abstract class LikeRepository {
  abstract countLikesByUserId(userId: string): Promise<number>;
}
