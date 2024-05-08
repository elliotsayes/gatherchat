import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Props {
    tags: Record<string, string>;
}

export const UdlTable = (props: Props) => {
    const { tags } = props;

    return (
        <Table>
            <TableCaption>UDL Tags for Arweave Transaction</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Tag Key</TableHead>
                    <TableHead>Tag Value</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Object.entries(tags).map(([key, value]) => {
                    return (
                        <TableRow key={key}>
                            <TableCell>{key}</TableCell>
                            <TableCell>
                                {key === "License" ? (
                                    <a
                                        href={`https://viewblock.io/arweave/tx/${value}`}
                                        target="_blank"
                                        className="underline"
                                        rel="noreferrer"
                                    >
                                        {value}
                                    </a>
                                ) : (
                                    value
                                )}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};
