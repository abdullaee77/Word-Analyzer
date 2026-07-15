const STOP_WORDS = new Set([
  'the', 'is', 'a', 'an', 'and', 'of', 'to', 'in', 'on', 'it', 'this',
  'that', 'for', 'with', 'as', 'are', 'was', 'were', 'be', 'been', 'being',
  'at', 'by', 'from', 'or', 'but', 'not', 'so', 'if', 'then', 'than', 'too',
  'very', 'can', 'will', 'just', 'i', 'you', 'he', 'she', 'we', 'they',
  'his', 'her', 'its', 'our', 'their', 'my', 'your', 'them', 'me', 'us',
  'do', 'did', 'does', 'has', 'have', 'had', 'would', 'could', 'should',
  'may', 'might', 'shall', 'about', 'into', 'which', 'who', 'what', 'when',
  'where', 'how', 'all', 'each', 'more', 'also', 'up', 'out', 'no', 'only'
])

module.exports = STOP_WORDS