import NodeEnvironment from 'jest-environment-node'
import configTest from 'firebase-functions-test'
import { existsSync } from 'fs'
import type {
	JestEnvironmentConfig,
	EnvironmentContext
} from '@jest/environment'

const docblockPragmasKeys: DocblockPragmasOptions[] = [
	'databaseURL',
	'serviceAccountId',
	'storageBucket',
	'projectId',
	'keyPath',
	'firebaseMode'
]

export default class FirebaseEnvironment extends NodeEnvironment {
	declare global: FirebaseGlobal & NodeEnvironment['global']
	private options: Options

	constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
		super(config, context)
		const options = config.projectConfig.testEnvironmentOptions
		if (!validateOptions(options))
			throw new Error(
				`Config Error! Missing "projectId" from testEnvironmentOptions.`
			)
		for (const key of docblockPragmasKeys)
			if (key in context.docblockPragmas)
				options[key] = context.docblockPragmas[key] as any
		this.options = options
	}

	async setup() {
		await super.setup()
		if (this.options.firebaseMode == 'online') {
			if (!this.options.keyPath)
				throw new Error(
					'Missing "keyPath" option (path to admin credentials).\nSee https://firebase.google.com/docs/functions/local-shell#set_up_admin_credentials_optional.'
				)
			if (!existsSync(this.options.keyPath))
				throw new Error(
					`Couldn't find admin credentials.\nNo file at ${this.options.keyPath}\nSee https://firebase.google.com/docs/functions/local-shell#set_up_admin_credentials_optional.`
				)
		}
		let { firebaseMode, keyPath, ...config } = this.options
		if (firebaseMode == 'offline') keyPath = undefined
		this.global.testEnv = configTest(config, keyPath)
		this.syncEnv('FIREBASE_CONFIG')
		this.syncEnv('GCLOUD_PROJECT')
		this.syncEnv('GOOGLE_APPLICATION_CREDENTIALS')
		this.global.process.env.JEST_ENV = FirebaseEnvironment.name
	}

	private syncEnv(key: string) {
		this.global.process.env[key] = process.env[key]
	}
}

function validateOptions(value?: Record<string, unknown>): value is Options {
	return value != undefined && 'projectId' in value
}

type AppOptions = NonNullable<Parameters<typeof configTest>[0]>

export type Options = Omit<AppOptions, 'projectId'> & {
	projectId: string
	keyPath?: string
	firebaseMode?: 'online' | 'offline'
}

type DocblockPragmasOptions = Exclude<
	{
		[K in keyof Options]: NonNullable<Options[K]> extends string ? K : never
	}[keyof Options],
	undefined
>

type FirebaseGlobal = {
	testEnv: ReturnType<typeof configTest>
}

declare global {
	const testEnv: FirebaseGlobal['testEnv']
}
