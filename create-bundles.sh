npx rollup lwc/async-no-yield/index.js \
	--file lwc/async-no-yield/bundle.js \
	--format cjs \
	-p 'commonjs={ignore:["node:worker_threads"]}' \
	-p 'replace={BUNDLE:true}'
npx rollup lwc/sync-no-yield/index.js \
	--file lwc/sync-no-yield/bundle.js \
	--format cjs \
	-p 'commonjs={ignore:["node:worker_threads"]}' \
	-p 'replace={BUNDLE:true}'
npx rollup lwc/async-yield/index.js \
	--file lwc/async-yield/bundle.js \
	--format cjs \
	-p 'commonjs={ignore:["node:worker_threads"]}' \
	-p 'replace={BUNDLE:true}'
npx rollup lwc/sync-yield/index.js \
	--file lwc/sync-yield/bundle.js \
	--format cjs \
	-p 'commonjs={ignore:["node:worker_threads"]}' \
	-p 'replace={BUNDLE:true}'
npx rollup lwc/engine-server/index.js \
	--file lwc/engine-server/bundle.js \
	--format cjs \
	-p 'commonjs={ignore:["node:worker_threads"]}' \
	-p 'replace={BUNDLE:true}' \
	-p '@rollup/plugin-node-resolve'
