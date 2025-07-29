package top.asimov.sparrow.util;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class VerificationCodeManager {

  private static final int CODE_LENGTH = 6;
  private static final int EXPIRE_MINUTES = 5;
  private static final Map<String, CodeInfo> codeMap = new ConcurrentHashMap<>();

  // clean up expired codes every minute
  static {
    Executors.newSingleThreadScheduledExecutor().scheduleAtFixedRate(
        VerificationCodeManager::cleanExpiredCodes, 1, 1, TimeUnit.MINUTES
    );
  }

  public static String generateCode() {
    Random random = new Random();
    StringBuilder code = new StringBuilder();
    for (int i = 0; i < CODE_LENGTH; i++) {
      code.append(random.nextInt(10));
    }
    return code.toString();
  }

  public static void saveCode(String userId, String email, String code) {
    codeMap.put(generateKey(userId, email), new CodeInfo(code, LocalDateTime.now().plusMinutes(EXPIRE_MINUTES)));
  }

  public static boolean checkCode(String userId, String email, String code) {
    CodeInfo info = codeMap.get(generateKey(userId, email));
    if (info == null || LocalDateTime.now().isAfter(info.expireAt)) {
      codeMap.remove(email);
      return false;
    }
    boolean valid = info.code.equals(code);
    if (valid) codeMap.remove(email); // remove code after successful validation
    return valid;
  }

  public static boolean canResend(String userId, String email) {
    CodeInfo info = codeMap.get(generateKey(userId, email));
    return info == null || LocalDateTime.now().isAfter(info.expireAt);
  }

  private static void cleanExpiredCodes() {
    LocalDateTime now = LocalDateTime.now();
    codeMap.entrySet().removeIf(e -> now.isAfter(e.getValue().expireAt));
  }

  private static String generateKey(String userId, String email) {
    return userId + ":" + email;
  }

  private static class CodeInfo {
    String code;
    LocalDateTime expireAt;
    CodeInfo(String code, LocalDateTime expireAt) {
      this.code = code;
      this.expireAt = expireAt;
    }
  }
}
