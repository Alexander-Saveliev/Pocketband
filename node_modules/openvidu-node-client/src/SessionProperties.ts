import { MediaMode } from "./MediaMode";
import { ArchiveMode } from "./ArchiveMode";
import { ArchiveLayout } from "./ArchiveLayout";

export class SessionProperties {

	constructor(private mediaModeProp: MediaMode, private archiveModeProp: ArchiveMode, private archiveLayoutProp: ArchiveLayout, private rCustomLayout: string) { }

	mediaMode(): string {
		return this.mediaModeProp;
	}

	archiveMode(): ArchiveMode {
		return this.archiveModeProp;
	}

	archiveLayout(): ArchiveLayout {
		return this.archiveLayoutProp;
	}

	customLayout(): string {
		return this.rCustomLayout;
	}
}

export namespace SessionProperties {
	export class Builder {

		private mediaModeProp: MediaMode = MediaMode.ROUTED;
		private archiveModeProp: ArchiveMode = ArchiveMode.MANUAL;
		private archiveLayoutProp: ArchiveLayout = ArchiveLayout.BEST_FIT;
		private rCustomLayout: string = '';

		build(): SessionProperties {
			return new SessionProperties(this.mediaModeProp, this.archiveModeProp, this.archiveLayoutProp, this.rCustomLayout);
		}

		mediaMode(mediaMode: MediaMode): Builder {
			this.mediaModeProp = mediaMode;
			return this;
		}

		archiveMode(archiveMode: ArchiveMode): Builder {
			this.archiveModeProp = archiveMode;
			return this;
		}

		archiveLayout(archiveLayout: ArchiveLayout): Builder {
			this.archiveLayoutProp = archiveLayout;
			return this;
		}

		customLayout(customLayout: string): Builder {
			this.rCustomLayout = customLayout;
			return this;
		}
	};
}
