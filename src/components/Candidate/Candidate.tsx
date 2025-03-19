import { Paper, Typography } from "@mui/material";
import styles from "./Candidate.module.scss";

interface CandidateProps {
  candidate: string;
}

export const Candidate: React.FC<CandidateProps> = ({ candidate }) => {
  return (
    <Paper elevation={2} className={styles.candidate}>
      <Typography variant="h5">{candidate}</Typography>
    </Paper>
  );
};
