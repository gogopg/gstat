import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EloRating } from "@/types/report";

type props = {
  ratings: EloRating[];
};

export default function EloRatingTable({ ratings }: props) {
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/2 font-bold">프로필</TableHead>
            <TableHead className="font-bold">점수</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ratings.map((rating, index) => (
            <TableRow key={rating.profile.id}>
              <TableCell className="font-medium">{rating.profile.name}</TableCell>
              <TableCell className="font-medium">{rating.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
