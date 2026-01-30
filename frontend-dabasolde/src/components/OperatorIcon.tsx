

interface OperatorIconProps {
    operator: 'inwi' | 'orange';
    size?: 'sm' | 'md' | 'lg';
}

export default function OperatorIcon({ operator, size = 'md' }: OperatorIconProps) {
    const isInwi = operator === 'inwi';

    // Colors
    const bgColor = isInwi ? '#e3005b' : '#ff6600';
    const label = isInwi ? 'INWI' : 'ORANGE'; // Generic text, no logo

    // Sizes
    let width = '60px';
    let fontSize = '0.9rem';
    let height = '40px';

    if (size === 'lg') {
        width = '100px';
        height = '60px';
        fontSize = '1.2rem';
    } else if (size === 'sm') {
        width = '40px';
        height = '26px';
        fontSize = '0.7rem';
    }

    return (
        <div style={{
            width: width,
            height: height,
            backgroundColor: bgColor,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            letterSpacing: '1px',
            fontSize: fontSize,
            border: '2px solid rgba(255,255,255,0.2)'
        }}>
            {label}
        </div>
    );
}
