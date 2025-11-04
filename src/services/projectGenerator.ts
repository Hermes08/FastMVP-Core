import archiver from 'archiver';
import fs from 'fs-extra';
import path from 'path';

interface ProjectConfig {
  name: string;
  description: string;
  features: string[];
  template: 'nextjs' | 'react' | 'node';
}

export class ProjectGenerator {
  private templatesPath: string;
  private outputPath: string;

  constructor() {
    this.templatesPath = path.join(process.cwd(), 'src', 'templates');
    this.outputPath = path.join(process.cwd(), 'tmp', 'projects');
  }

  async generateProject(config: ProjectConfig): Promise<string> {
    const projectPath = path.join(this.outputPath, config.name);
    
    // Ensure output directory exists
    await fs.ensureDir(projectPath);

    // Copy base template
    const templatePath = path.join(this.templatesPath, 'base');
    await fs.copy(templatePath, projectPath);

    // Generate package.json
    await this.generatePackageJson(projectPath, config);

    // Generate project files based on features
    await this.generateFeatureFiles(projectPath, config);

    // Create ZIP file
    const zipPath = await this.createZip(projectPath, config.name);

    // Clean up temp directory
    await fs.remove(projectPath);

    return zipPath;
  }

  private async generatePackageJson(projectPath: string, config: ProjectConfig) {
    const packageJson = {
      name: config.name,
      version: '0.1.0',
      description: config.description,
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint'
      },
      dependencies: {
        'next': '^14.0.0',
        'react': '^18.2.0',
        'react-dom': '^18.2.0'
      },
      devDependencies: {
        '@types/node': '^20.0.0',
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        'typescript': '^5.0.0',
        'eslint': '^8.0.0',
        'eslint-config-next': '^14.0.0'
      }
    };

    await fs.writeJson(
      path.join(projectPath, 'package.json'),
      packageJson,
      { spaces: 2 }
    );
  }

  private async generateFeatureFiles(projectPath: string, config: ProjectConfig) {
    // Create basic directory structure
    await fs.ensureDir(path.join(projectPath, 'src', 'app'));
    await fs.ensureDir(path.join(projectPath, 'src', 'components'));
    await fs.ensureDir(path.join(projectPath, 'public'));

    // Generate README
    const readmeContent = `# ${config.name}\n\n${config.description}\n\n## Features\n\n${config.features.map(f => `- ${f}`).join('\n')}\n\n## Getting Started\n\nFirst, install dependencies:\n\n\`\`\`bash\nnpm install\n\`\`\`\n\nThen, run the development server:\n\n\`\`\`bash\nnpm run dev\n\`\`\`\n\nOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.`;
    
    await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent);

    // Generate .gitignore
    const gitignoreContent = `node_modules/\n.next/\nout/\nbuild/\n.DS_Store\n*.log\n.env*.local`;
    await fs.writeFile(path.join(projectPath, '.gitignore'), gitignoreContent);

    // Generate tsconfig.json
    const tsconfigContent = {
      compilerOptions: {
        target: 'ES2020',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [{ name: 'next' }],
        paths: { '@/*': ['./src/*'] }
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules']
    };
    
    await fs.writeJson(
      path.join(projectPath, 'tsconfig.json'),
      tsconfigContent,
      { spaces: 2 }
    );
  }

  private async createZip(projectPath: string, projectName: string): Promise<string> {
    const zipPath = path.join(this.outputPath, `${projectName}.zip`);
    await fs.ensureDir(this.outputPath);

    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => resolve(zipPath));
      archive.on('error', (err) => reject(err));

      archive.pipe(output);
      archive.directory(projectPath, false);
      archive.finalize();
    });
  }
}

export default ProjectGenerator;
