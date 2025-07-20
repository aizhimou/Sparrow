package top.asimov.sparrow.model;

import com.baomidou.mybatisplus.annotation.TableId;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @TableId
    private String id;
    private String username;
    private Integer role; // -1: root, 0: admin, 1: user

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String salt;

    private String email;
    private Integer status; // 0: inactive, 1: active
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private transient String newPassword; // For password update

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private transient String token; // For token management
}