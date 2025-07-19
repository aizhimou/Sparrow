package top.asimov.sparrow.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

public class PasswordUtil {

  private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  private static final SecureRandom RANDOM = new SecureRandom();

  // generate random salt
  public static String generateSalt(int length) {
    StringBuilder sb = new StringBuilder(length);
    for (int i = 0; i < length; i++) {
      int index = RANDOM.nextInt(CHARACTERS.length());
      sb.append(CHARACTERS.charAt(index));
    }
    return sb.toString();
  }

  // generate encrypted password
  public static String generateEncryptedPassword(String plainPassword, String salt) {
    try {
      MessageDigest md = MessageDigest.getInstance("MD5");
      String input = plainPassword + salt;
      byte[] digest = md.digest(input.getBytes());
      StringBuilder sb = new StringBuilder();
      for (byte b : digest) {
        sb.append(String.format("%02x", b));
      }
      return sb.toString();
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException("MD5 algorithm is unavailable", e);
    }
  }

  // 验证密码
  public static boolean verifyPassword(String plainPassword, String salt, String storedEncryptedPassword) {
    String encryptedPassword = generateEncryptedPassword(plainPassword, salt);
    return encryptedPassword.equals(storedEncryptedPassword);
  }

}
