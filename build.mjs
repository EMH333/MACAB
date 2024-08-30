import { sassPlugin } from 'esbuild-sass-plugin';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import { postcssPlugin as uncss } from 'uncss';
import esbuild from 'esbuild';
import fs from 'fs';

const outDirectory = 'public';

function copyHTML() {
    const folders = [
        'images',
    ];

    for (let i = 0; i < folders.length; i++) {
        if (!fs.existsSync(`./${outDirectory}/${folders[i]}`)) {
            fs.mkdirSync(`./${outDirectory}/${folders[i]}`);
        }
    }

    const files = [
        'images/icon-192.png',
        'images/icon-512.png',
        'images/uploadIcon.png',
    ];

    for (let i = 0; i < files.length; i++) {
        fs.copyFileSync(`./dev/${files[i]}`, `./${outDirectory}/${files[i]}`);
    }

    const mappedFiles = {
        'json/dates.json': 'dates.json',
        'json/manifest.json': 'manifest.json',
        'html/index.html': 'index.html',
        'html/schedule.html': 'schedule.html',
        'html/about.html': 'about.html',
    };

    for (const [key, value] of Object.entries(mappedFiles)) {
        fs.copyFileSync(`./dev/${key}`, `./${outDirectory}/${value}`);
    }
}

var postCssOpts = [
    autoprefixer(),
    uncss({
        html: ['public/*.html'],
        ignore: [/\.cal.*/, '.invisible', '.visible', '.r', '.col', '.fade-in', '.fade-out'],
        jsdom: {
            runScripts: "outside-only",
        },
        timeout: 100,
    })
];

let compileOptions = {
    entryPoints: ['dev/js/main.js', 'dev/serviceWorker/sw.js'],
    entryNames: '[name]',
    outdir: 'public/',
    target: 'es2020',
    bundle: true,
    minify: true,
    metafile: true,
    plugins: [sassPlugin({
        outputStyle: 'compressed',
        async transform(source, resolveDir, filepath) {
            const {css} = await postcss(postCssOpts).process(source, {from: filepath});
            return css;
        }
    })]
};

if (process.argv[2] === "production") {
    compileOptions.pure = ['console.log'];
}

// remove build directory if building clean or for production
if (process.argv.length >= 2 && (process.argv[2] === "clean" || process.argv[2] === "production")) {
    if (fs.existsSync(outDirectory)) {
        fs.rmSync(outDirectory, { recursive: true });
    }
}


// make sure public exists
if (!fs.existsSync(outDirectory)) {
    fs.mkdirSync(outDirectory);
}

//copy all the html files
copyHTML();

if (process.argv.length >= 2 && process.argv[2] === "serve") {
    let serveOptions = compileOptions;
    serveOptions.minify = false;

    let context = esbuild.context(serveOptions);
    context.then((cxt) => {
        //console.log(cxt);
        cxt.serve({
            port: 3000,
            servedir: `./${outDirectory}`,
        }).then(() => {
            // Call "stop" on the server when you're done
            //server.stop()
            //process.exit(0)
        });
    });
} else {
    //allow for non-minified code
    if (process.argv.length >= 2 && process.argv[2] === "dev") { compileOptions.minify = false; compileOptions.watch = true; }

    //allow for non-minified code but no watching
    if (process.argv.length >= 2 && process.argv[2] === "ci") { compileOptions.minify = false; }

    esbuild.build(compileOptions)
        .then(output => {
            //fs.writeFileSync('./public/metafile.json', JSON.stringify(output.metafile));

            //do some quick bundle calculations
            let bundleSize = 0;
            for (let file in output.metafile.outputs) {
                //don't include map files
                if (file.endsWith(".map")) { continue; }
                bundleSize += output.metafile.outputs[file].bytes;
            }
            console.log(`JS bundle size: ${(bundleSize / 1024).toFixed(2)} kb`);
        })
        .catch((err) => { console.error(err); process.exit(1); });
}
