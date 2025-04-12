export abstract class LikeRepository {
  abstract countLikesByUserId(userId: string): Promise<number>;
  abstract registerLike(userId: string, likedUserId: string): Promise<boolean>;
  abstract checkIfMatch(userId: string, likedUserId: string): Promise<boolean>;
  abstract getLikedProfiles(userId: string): Promise<string[]>;
}
