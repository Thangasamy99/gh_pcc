package com.hospital.superadmin.dto.request;
import lombok.Data;

@Data
public class UpdateSystemSettingsRequest {
    private String systemName;
    private String systemVersion;
    private String timeZone;
    private String dateFormat;
    private String timeFormat;
    private Boolean maintenanceMode;
    private Boolean allowSelfRegistration;
    private Integer sessionTimeout;
    private Integer maxLoginAttempts;
    private Integer passwordExpiryDays;
    private Boolean twoFactorAuth;
    private String defaultLanguage;
    private String defaultTheme;
    private Boolean backupEnabled;
    private String backupFrequency;
    private Integer retentionPeriodDays;
    private Boolean emailNotificationsEnabled;
    private Boolean smsNotificationsEnabled;
    private String systemEmail;
    private String supportPhone;
}
