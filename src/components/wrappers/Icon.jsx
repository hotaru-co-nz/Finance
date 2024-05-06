export default function Icon({P,className, s=5}){
    return (
        <div className={className}>
            <P className={`size-${s}`}/>
        </div>
    )
}