import Typography from '@mui/material/Typography'
import { Box, Card } from '@mui/material'
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 2,
    marginBottom: 5,
  }

  return (
    <Card variant="outlined">
      <Link to={`/blogs/${blog.id}`}>
        <Typography
          variant="body1"
          sx={{ p: 2 }}
        >
          {blog.title} {blog.author}{' '}
        </Typography>
      </Link>
    </Card>
  )
}

export default Blog
