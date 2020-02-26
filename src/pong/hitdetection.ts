import { Vector2 } from './vector2';
import { Rectangle} from './rectangle';
import { Segment } from './segment';
import { Circle } from './circle';
export class HitDetection{
    constructor(){}

    hit(circle: Circle, rectangle: Rectangle): boolean{
        if(this.pointInRectangle(circle.point, rectangle)){
            return true;
        }

        let leftTop: Vector2 = new Vector2(rectangle.x, rectangle.y);
        let rightTop: Vector2 = new Vector2(rectangle.x + rectangle.width, rectangle.y);
        let leftBottom: Vector2 = new Vector2(rectangle.x, rectangle.y + rectangle.height);
        let rightBottom: Vector2 = new Vector2(rectangle.x + rectangle.width, rectangle.y + rectangle.height);

        let topSegment: Segment = new Segment(leftTop, rightTop);
        let rightSegment: Segment = new Segment(rightTop, rightBottom);
        let bottomSegment: Segment = new Segment(leftBottom, rightBottom);
        let leftSegmebnt: Segment = new Segment(leftTop, leftBottom);

        if(this.intersects(topSegment, circle)) return true;
        if(this.intersects(rightSegment, circle)) return true;
        if(this.intersects(bottomSegment, circle)) return true;
        if(this.intersects(leftSegmebnt, circle)) return true;
        return false;
    }

    pointInRectangle(point: Vector2, rectangle: Rectangle): boolean{
        if( point.x >= rectangle.x && point.x <= rectangle.x + rectangle.width
            && point.y >= rectangle.y && point.y <= rectangle.y + rectangle.height)
        {
            return true;
        }
        return false;
    }

    intersects(segment: Segment, circle: Circle): boolean{
        if(this.segmentDistanceToPoint(segment, circle.point) <= circle.radius){
            return true;
        }
        return false;
    }

    segmentDistanceToPoint(segment: Segment, point: Vector2): number{

        let px: number = segment.b.x - segment.a.x;
        let py: number = segment.b.y - segment.a.y;

        let distanceSquared = px * px + py *py;
        // if zero segment is a point
        if(Math.abs(distanceSquared) <= Number.EPSILON){
            let tempx: number = segment.a.x - point.x;
            let tempy: number = segment.a.y - point.y;
            return Math.sqrt(tempx * tempx + tempy * tempy);
        }
        let u: number = ((point.x - segment.a.x) * px + (point.y - segment.a.y) * py) / distanceSquared;
        if(u > 1) u = 1;
        if(u < 0) u = 0;

        let x: number = segment.a.x + u * px;
        let y: number = segment.a.y + u * py;

        let dx: number = x - point.x;
        let dy: number = y - point.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

}