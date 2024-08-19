const COMMON_STYLES = 'text-3xl p-2'

export const ENTITIES_COMPONENT = {
    POLYANET: () => <div className={COMMON_STYLES}>🪐</div>,
    SPACE: () => <div className={COMMON_STYLES}>🌌</div>,
    WHITE_SOLOON: () => <div className={COMMON_STYLES} style={{ filter: 'grayscale(100%)' }}>🌕</div>,
    PURPLE_SOLOON: () => <div className={COMMON_STYLES} style={{ filter: 'grayscale(100%) brightness(70%) sepia(50%) hue-rotate(-100deg) saturate(500%) contrast(1)' }}>🌕</div>,
    RED_SOLOON: () => <div className={COMMON_STYLES} style={{ filter: 'grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)' }}>🌕</div>,
    BLUE_SOLOON: () => <div className={COMMON_STYLES} style={{ filter: 'grayscale(100%) brightness(30%) sepia(100%) hue-rotate(-180deg) saturate(700%) contrast(0.8)' }}>🌕</div>,
    LEFT_COMETH: () => <div className={COMMON_STYLES} style={{ transform: 'rotate(330deg)' }}>☄️</div>,
    RIGHT_COMETH: () => <div className={COMMON_STYLES} style={{ transform: 'rotate(140deg)' }}>☄️</div>,
    UP_COMETH: () => <div className={COMMON_STYLES} style={{ transform: 'rotate(48deg)' }}>☄️</div>,
    DOWN_COMETH: () => <div className={COMMON_STYLES} style={{ transform: 'rotate(230deg)' }}>☄️</div>,
} as const

interface MegaverseEntityProps {
    entity: EntityKey
}

export type EntityKey = keyof typeof ENTITIES_COMPONENT

export const MegaverseEntity: React.FC<MegaverseEntityProps> = ({ entity }) => {
    const EntityComponent = ENTITIES_COMPONENT[entity]
    return <EntityComponent />
};
  