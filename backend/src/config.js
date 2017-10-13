import path from 'path';

export default () => {
  const self = {
    db: {
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_DATABASE || 'database_name',
      logging: true
    },
    jwtSecret: '~<#c-c*#{+f;kJ%h4TwBRtW]Zx,/RNY!',
    isDeveloping: process.env.NODE_ENV !== 'production',
    port: process.env.PORT || 3001,
    uploadDir: path.join(__dirname, '../uploads'),
    createUploadPath: filename => path.join(self.uploadDir, filename)
  };

  return self;
};
